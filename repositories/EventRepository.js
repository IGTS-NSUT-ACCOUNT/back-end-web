const Event = require('./../models/event/Event');

// create event
const createEvent = async (user_id, {
    event_title,
    date_time,
    main_poster,
    details,
    event_moderators,
    event_photos,
    location
}) => {
    console.log(event_photos)
    const newEvent = new Event({
        event_title,
        date_time,
        main_poster,
        details,
        event_moderators,
        created_by: user_id,
        event_photos:event_photos,
        location:location
    });
    console.log(newEvent);
    const savedEvent = await newEvent.save();
    return savedEvent;
}
const getEventById = async (event_id) => {
    const event = await Event.findById(event_id);
    return event;
}


// update event information
const updateEventInfo = async (event_id, user_id, {
    event_title,
    date_time,
    main_poster,
    event_photos,
    details,
    location,
}) => {
    const event = await getEventById(event_id);
    event = {
        ...event,
        event_title,
        event_photos,
        date_time,
        main_poster,
        details,
        location,
        created_by: user_id
    }
    const savedEvent = await event.save();
    return event;
}
// update registration closed
const enableRegistration = async (event_id) => {
    const event = await getEventById(event_id);
    event.registrations_open = true;
    const savedEvent = await event.save();
    return savedEvent;
}
// update registration active
const disableRegistration = async (event_id) => {
    const event = await getEventById(event_id);
    event.registrations_open = false;
    const savedEvent = await event.save();
    return savedEvent;
}
// add a registration
const registerUser = async (user_id, event_id) => {
    const event = await getEventById(event_id);
    event.registrations.push(user_id);
    const savedEvent = await event.save();
    return savedEvent;
}
// set event active
const enableEventActive = async (event_id) => {
    const event = await getEventById(event_id);
    event.active = true;
    const savedEvent = await event.save();
    return savedEvent;
}
// set event inactive
const disableEventActive = async (event_id) => {
    const event = await getEventById(event_id);
    event.active = false;
    const savedEvent = await event.save();
    return savedEvent;
}

const getEvents = async (pge_no, limit) => {

    const events = await Event.find().sort({
        date_time: -1
    }).skip(pge_no * limit).limit(limit);

    return events;
}

const deleteRegistrationOfUser = async (event_id, user_id) => {
    const event = await Event.findById(event_id);
    event.registrations = event.registrations.filter((el) => !el.equals(user_id))
    await event.save();
}

module.exports = {
    createEvent,
    getEventById,
    updateEventInfo,
    registerUser,
    enableEventActive,
    enableRegistration,
    disableEventActive,
    disableRegistration,
    getEvents,
    deleteRegistrationOfUser,
}