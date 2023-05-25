const Event = require('./../models/event/Event');


const parseGoogleDriveUrl = (url)=> {
    // Check if the URL is a Google Drive URL.
    if (!url.startsWith("https://drive.google.com/file/d/")) {
      return url;
    }
  
    // Extract the file ID from the URL.
    const fileId = url.split("/d/")[1].split("/")[0];
  
    return `https://drive.google.com/uc?export=view&id=${fileId}`
    // // Create a new Google Drive API client.
    // const drive = new google.drive.Drive();
  
    // // Get the file by ID.
    // const file = await drive.files.get(fileId);
  
    // // Return the file's direct link.
    // return file.webViewLink;
  }

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

    const photos_url_parsed = event_photos.map((photo)=>{return parseGoogleDriveUrl(photo)});
    const poster_url_parsed= parseGoogleDriveUrl(main_poster);
    const newEvent = new Event({
        event_title,
        date_time,
        main_poster:poster_url_parsed,
        details,
        event_moderators,
        created_by: user_id,
        event_photos: photos_url_parsed,
        location: location
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
    event_moderators,
    event_photos,
    details,
    location,
}) => {

    const photos_url_parsed = event_photos.map((photo)=>{return parseGoogleDriveUrl(photo)});
    const poster_url_parsed= parseGoogleDriveUrl(main_poster);

    var event =await getEventById(event_id);
    console.log("check",event);
    event = {
        ...event,
        event_title,
        event_photos:photos_url_parsed,
        date_time,
        main_poster:poster_url_parsed,
        details,
        event_moderators,
        location,
        created_by: user_id
    }
    console.log(event);
    const savedEvent = await event.save();
    return savedEvent;
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

    const events = await Event.find({
        active: true
    }).sort({
        date_time: -1
    }).skip(pge_no * limit).limit(limit);

    return events;
}
const getEvents2 = async (pge_no, limit) => {

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
const deleteEvent = async (event_id) => {
    await Event.findByIdAndDelete(event_id);
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
    getEvents2,
    deleteRegistrationOfUser,
    deleteEvent,
}