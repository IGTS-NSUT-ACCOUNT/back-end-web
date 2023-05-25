const {
    default: mongoose
} = require('mongoose');
const ModeratorTicket = require('../models/event/ModeratorTicket');
const EventRepository = require('./../repositories/EventRepository')
const UserService = require('./../services/UserService');
const ParticipationTicket = require('../models/event/ParticipationTicket');
const jwt = require("jsonwebtoken");
const User = require("../models/user/User");
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const fs = require('fs');
const UserRepository = require('./../repositories/UserRepository');
const SERVER_URL = process.env.FRONT_END_URL;
const keysecret = process.env.JWT_SECRET;
const sender_email = process.env.SENDER_EMAIL;
const sender_email_pass = process.env.SENDER_EMAIL_PASS;
const EmailHTML = require("./EmailHTML")

// const EmailTemplate = require("./beefree-4aqd7j91k52")

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: sender_email,
                pass: sender_email_pass
            }
        })

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error", error);
                return reject({
                    message: `An error has occured`
                })
                //   res.status(401).json({status:401,message:"Email not sent"})
            } else {
                console.log("Email sent", info.response);
                //   res.status(201).json({status:201,message:"Email sent successfully"});
                return resolve({
                    message: `Email Sent Successfully`
                })
            }
        })
    })
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: sender_email,
        pass: sender_email_pass
    }
})

// create a new event
// - issue moderation tickets
// - create event

const getAnEvent = async (event_id, user_id) => {
    const event = await EventRepository.getEventById(event_id);
    const res = event.toObject();

    if (user_id) {

        // check if the user is already registered or not
        const ticket = await ParticipationTicket.findOne({
            event_id,
            user_id
        });

        if (ticket)
            res.registered = true;
        else res.registered = false;
    }

    return res;
}

const createAnEvent = async (user_id, event_info) => {

    // moderators
    const moderator_ids = event_info.event_moderators;

    const userPromises = moderator_ids.map(async (element) => {
        const user = await UserService.getUserByEmail(element);
        if (user.society_member) {
            return user._id;
        }
    });


    const user_ids = await Promise.all(userPromises);
    const savedEvent = await EventRepository.createEvent(user_id, {
        event_title: event_info.event_title,
        date_time: new Date(event_info.date_time),
        main_poster: event_info.main_poster,
        details: event_info.details,
        event_moderators: user_ids ? user_ids : [],
        location: event_info.location,
        event_photos: event_info.event_photos
    })

    // tickets
    user_ids.forEach(async (el) => {
        const newTicket = new ModeratorTicket({
            event_id: savedEvent._id,
            user_id: el
        })
        const savedTicket = await newTicket.save();

        console.log(1)
        // email them the ticket

        try {
            const userfind = await UserService.getUser(el);
            // console.log(userfind)
            //token generate for reset password
            const token = jwt.sign({
                _id: userfind._id
            }, keysecret, {
                expiresIn: "30d"
            });

            const setusertoken = await User.findByIdAndUpdate({
                _id: userfind._id
            }, {
                verifytoken: token
            }, {
                new: true
            });
            if (setusertoken) {
                const mailOptions = {
                    from: sender_email,
                    to: userfind.email,
                    subject: "Sending Moderation Ticket For Event",
                    text: `
                    Link to access list of Event Moderators: ${SERVER_URL}/event/${savedEvent._id}/viewmembers
                    Link to accedd/edit Event Details: ${SERVER_URL}/event-creation/${savedEvent._id}`
                }

                console.log(mailOptions);
                sendEmail(mailOptions);
            }
        } catch (error) {
            // res.status(401).json({status:401,message:"Invalid User"})
            console.log(error);
        }
        // /:event_id/edit

    })


}

// update event information
const updateEventInfo = async (event_id, user_id, event_info) => {

    const event = await EventRepository.getEventById(event_id);

    event_info.event_moderators = await Promise.all(event_info.event_moderators.map((el)=>{
        const user = UserRepository.getUserByEmail(el);
        return user.user_id;
    }));

    console.log(event_info.event_moderators)
    // delete removed tickets

    if (!event.event_moderators)
        event.event_moderators = [];

    if (!event_info.event_moderators)
        event_info.event_moderators = [];

    const toBeDeletedTickets = event.event_moderators.filter((el, i) => event_info.event_moderators.includes(el.toString()));

    toBeDeletedTickets.forEach(async (el) => {
        await ModeratorTicket.findOneAndDelete({
            event_id: event_id,
            user_id: el
        });
    })
    const deletedRemoved = event.event_moderators.filter((el, i) => !event_info.event_moderators.includes(el.toString()));
    event.event_moderators = deletedRemoved;
    await event.save();

    // add the new tickets

    const ticketsToBeAdded = event_info.event_moderators.filter((el, i) => !event.event_moderators.includes(new mongoose.mongo.ObjectId(el)))
    var user_ids = [];
    ticketsToBeAdded.map(async (element) => {
        const user = await UserService.getUser(new mongoose.mongo.ObjectId(element));
        console.log(user);
        if (user.society_member)
            user_ids.push(user._id);
    });
    event.event_moderators += user_ids;
    await event.save();

    // tickets
    user_ids.forEach(async (el) => {
        const newTicket = new ModeratorTicket({
            event_id: savedEvent._id,
            user_id: el
        })
        const savedTicket = await newTicket.save();

        // email them the ticket
        try {
            const userfind = await UserService.getUser(el);
            // console.log(userfind)
            //token generate for reset password
            const token = jwt.sign({
                _id: userfind._id
            }, keysecret, {
                expiresIn: "30d"
            });

            const setusertoken = await User.findByIdAndUpdate({
                _id: userfind._id
            }, {
                verifytoken: token
            }, {
                new: true
            });
            if (setusertoken) {
                const mailOptions = {
                    from: sender_email,
                    to: userfind.email,
                    subject: "Sending Moderation Ticket For Event",
                    text: `
                Link to access list of Event Moderators: ${SERVER_URL}/event/${savedEvent._id}/viewmembers
                Link to accedd/edit Event Details: ${SERVER_URL}/event-creation/${savedEvent._id}`
                }

                sendEmail(mailOptions)
            }
        } catch (error) {
            // res.status(401).json({status:401,message:"Invalid User"})
            console.log(error);
        }
        // /:event_id/edit

    })



    const savedEvent = await EventRepository.updateEventInfo(event_id, user_id, {
        event_title: event_info.event_title,
        date_time: event_info.date_time,
        main_poster: event_info.main_poster,
        details: event_info.details,
        event_photos: event_info.event_photos
    });

    return savedEvent;

}

//Generate QR code for registered participants


const generateQRCode = async (ticketData) => {
    try {
        const qrCodeData = JSON.stringify(ticketData); // Convert ticket data to a JSON string
        const qrCodeOptions = {
            errorCorrectionLevel: 'H', // High error correction level
            type: 'png', // Output QR code as PNG image
            quality: 0.92, // Image quality (0.01 - 1.0)
            margin: 1, // QR code margin
        };

        const qrCodeImage = await QRCode.toFile('qrcode.png', qrCodeData, qrCodeOptions);
        console.log('QR code generated successfully.');
        console.log('QR code saved as qrcode.png');

        return qrCodeImage;
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
};

// register for an event
const registerForEvent = async (user_id, event_id, registeration_info) => {

    // add to the list 
    const savedEvent = await EventRepository.registerUser(user_id, event_id);

    // issue registeration ticket
    const newRegisterationTicket = new ParticipationTicket({
        user_id: user_id,
        event_id: event_id,
        ...registeration_info
    })
    await newRegisterationTicket.save();

    //Generate QR Code

    // const QRImage = generateQRCode(newRegisterationTicket);






    // add event id to user
    const updatedUser = await UserService.registerUserForEvent(user_id, event_id);

    // email the ticket to the user
    try {
        const userfind = await UserService.getUser(user_id);
        // console.log(userfind)
        //token generate for reset password
        const token = jwt.sign({
            _id: user_id,
        }, keysecret, {
            expiresIn: "30d"
        });

        const setusertoken = await User.findByIdAndUpdate({
            _id: user_id
        }, {
            verifytoken: token
        }, {
            new: true
        });

        //Create Email HTML Template
        const event = await EventRepository.getEventById(event_id);
        const newUser = await UserService.getUser(user_id);
        const edit_link = `${SERVER_URL}/events/${savedEvent._id}`
        var day = event.date_time.getDate();
        var month = event.date_time.getMonth();
        var year = event.date_time.getFullYear()
        newDate = day + "/" + month + "/" + year
        const html = await EmailHTML.createHTML(event.main_poster, newDate, edit_link, newUser.name.first_name, newUser.name.last_name);



        //Email data Initialization
        if (setusertoken) {
            const mailOptions = {
                from: sender_email,
                to: userfind.email,
                subject: "Sending Participation Ticket For Event",

                text: `Link to access list of Event Moderators: ${SERVER_URL}/events/${savedEvent._id}`,
                html: html
            }

            sendEmail(mailOptions)
        }
    } catch (error) {
        // res.status(401).json({status:401,message:"Invalid User"})
        console.log(error);
    }


    return savedEvent;


}


// update registeration ticket
const updateRegistration = async (user_id, event_id, updatedInfo) => {

    const registrationTicket = await ParticipationTicket.findOne({
        event_id,
        user_id
    });
    registrationTicket = {
        ...registrationTicket,
        ...updatedInfo
    };
    const updatedTicket = await registrationTicket.save();

    // mail the ticket


    return true;

}


// set event registeration off
const disableRegistration = async (event_id) => {
    const savedEvent = await EventRepository.disableRegistration(event_id);
    return savedEvent;
}

// set event registration on
const enableRegistration = async (event_id) => {
    const savedEvent = await EventRepository.enableRegistration(event_id);
    return savedEvent;
}

// set event active on
const enableEventActive = async (event_id) => {
    const savedEvent = await EventRepository.enableEventActive(event_id);
    return savedEvent;
};
// set event active off
const disableEventActive = async (event_id) => {
    const savedEvent = await EventRepository.disableEventActive(event_id);
    return savedEvent;
};

const getAllEvents = async (pge_no, limit) => {
    console.log(limit);
    const events = await EventRepository.getEvents(pge_no, limit);
    return events;
}

const getAllEvents2 = async (pge_no, limit) => {
    const events = await EventRepository.getEvents2(pge_no, limit);
    return events;
}

const getRegisteredUsers = async (event_id) => {

    const tickets = await ParticipationTicket.find({
        event_id
    });

    return tickets;

}

const getRegistrationTicket = async (event_id, user_id) => {
    const ticket = await ParticipationTicket.findOne({
        event_id,
        user_id
    });
    return ticket;
}

const deleteRegistrationOfUser = async (event_id, user_id) => {

    // delete the ticket
    await ParticipationTicket.findOneAndDelete({
        event_id,
        user_id
    });

    // delete it from the event's registered users list
    await UserRepository.unregisterUserForEvent(user_id, event_id);

    await EventRepository.deleteRegistrationOfUser(event_id, user_id);

}

const getAnEventDraft = async (event_id) => {
    console.log("event_id", event_id);
    const event = await EventRepository.getEventById(event_id);
    // const list = []
    console.log("event",event)
    const getEmail = async (moderator) => {
        const user = await UserService.getUser(moderator);
        return user.email;
    };
    
    const list = await Promise.all(event.event_moderators.map(getEmail));

    const event2 = event.toObject();
    event2.event_moderators = list;

    return event2;

}

const deleteEvent = async (event_id) => {

    // delte all the tickets
    await ParticipationTicket.deleteMany({
        event_id
    });
    await ModeratorTicket.deleteMany({
        event_id
    });

    // delete event
    await EventRepository.deleteEvent(event_id);
    return;

}

const getEventsByNew = async (pge_no) => {

    const events = await EventRepository.getEvents(pge_no, 30);
    return events;
}

module.exports = {
    createAnEvent,
    updateEventInfo,
    updateRegistration,
    registerForEvent,
    enableEventActive,
    enableRegistration,
    disableEventActive,
    disableRegistration,
    getAllEvents,
    getEventsByNew,
    getAnEvent,
    deleteRegistrationOfUser,
    getRegisteredUsers,
    getAnEventDraft,
    getRegistrationTicket,
    getAllEvents2,
    deleteEvent,
}