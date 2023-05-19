const {
    default: mongoose
} = require('mongoose');
const ModeratorTicket = require('../models/event/ModeratorTicket');
const EventRepository = require('./../repositories/EventRepository')
const UserService = require('./../services/UserService');
const ParticipationTicket = require('../models/event/ParticipationTicket');

// create a new event
// - issue moderation tickets
// - create event
const createAnEvent = async (user_id, event_info) => {

    // moderators
    const moderator_ids = event_info.event_moderators;
    const user_ids = [];
    moderator_ids.map(async (element) => {

        const user = await UserService.getUser(new mongoose.mongo.ObjectId(element));
        if (user.society_member)
            user_ids.push(user._id);

    });

    const savedEvent = await EventRepository.createEvent(user_id, {
        event_title: event_info.event_title,
        date_time: event_info.date_time,
        main_poster: event_info.main_poster,
        details: event_info.details,
        event_moderators: user_ids
    })

    // tickets
    user_ids.forEach(async (el) => {
        const newTicket = new ModeratorTicket({
            event_id: savedEvent._id,
            user_id: el
        })
        const savedTicket = await newTicket.save();

        // email them the ticket


    })


}

// update event information
const updateEventInfo = async (event_id, user_id, event_info) => {

    const event = await EventRepository.getEventById(event_id);

    // delete removed tickets
    const toBeDeletedTickets = event.event_moderators.filter((el, i) => event_info.moderator_ids.includes(el.toString()));

    toBeDeletedTickets.forEach(async (el) => {
        await ModeratorTicket.findOneAndDelete({
            event_id: event_id,
            user_id: el
        });
    })
    const deletedRemoved = event.event_moderators.filter((el, i) => !event_info.moderator_ids.includes(el.toString()));
    event.event_moderators = deletedRemoved;
    await event.save();

    // add the new tickets
    const ticketsToBeAdded = event_info.event_moderators.filter((el, i) => !event.event_moderators.includes(new mongoose.mongo.ObjectId(el)))
    const user_ids = [];
    ticketsToBeAdded.map(async (element) => {
        const user = await UserService.getUser(new mongoose.mongo.ObjectId(element));
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


    })


    const savedEvent = await EventRepository.updateEventInfo(event_id, user_id, {
        event_title: event_info.event_title,
        date_time: event_info.date_time,
        main_poster: event_info.main_poster,
        details: event_info.details,
    });

    return savedEvent;

}

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

    // email the ticket to the user


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


module.exports = {
    createAnEvent,
    updateEventInfo,
    updateRegistration,
    registerForEvent,
    enableEventActive,
    enableRegistration,
    disableEventActive,
    disableRegistration,
}