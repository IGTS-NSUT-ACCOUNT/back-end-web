const { default: mongoose, Mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const subtopicSchema = new Schema(
  {
    name: String,
    blog_ids: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

const Subtopic = mongoose.model("Subtopic", subtopicSchema);
module.exports = Subtopic;
