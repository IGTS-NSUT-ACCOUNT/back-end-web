const {
    default: mongoose,
    Mongoose
} = require("mongoose");

const Schema = mongoose.Schema;
const moderatorTicketSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    event_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Event'
    }

});

const ModeratorTicket = mongoose.model("ModeratorTicket", moderatorTicketSchema);
module.exports = ModeratorTicket;