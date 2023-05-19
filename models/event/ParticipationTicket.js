const {
    default: mongoose,
    Mongoose
} = require("mongoose");

const Schema = mongoose.Schema;
const participationTicketSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    event_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Event'
    },
    name: {
        first_name: String,
        last_name: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
        validate: [isEmail, "invalid email"],
    },

    phone: {
        type: Number,
        match: /^\+?[0-9]{1,3}?[-.\s]?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}$/,
    },

    organization: {
        type: String,
    },

    // optional
    organization_roll_number: {
        type: String,
    },
    organization_branch: {
        type: String,
    }

});

const ParticipationTicket = mongoose.model("ParticipationTicket", participationTicketSchema);
module.exports = ParticipationTicket;