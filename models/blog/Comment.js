const { default: mongoose, Mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    content: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      default: 0,
    },
    scored_by: {
      user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      score: Boolean,
    },
    replies: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
