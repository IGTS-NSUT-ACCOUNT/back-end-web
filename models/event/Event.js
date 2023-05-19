const {
    default: mongoose,
    Mongoose
} = require("mongoose");

const Schema = mongoose.Schema;
const eventSchema = new Schema({
    event_title: String,
    date_time: Date,
    location: String,
    main_poster: String,
    details: String,

    event_moderators: [{
        type: mongoose.mongo.ObjectId,
        ref: "User"
    }],

    active: {
        type: Boolean,
        default: false
    },

    registerations_open: {
        type: Boolean,
        default: false
    },

    registrations: [{
        type: mongoose.mongo.ObjectId,
        ref: "User"
    }],
    created_by: {
        type: mongoose.mongo.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;