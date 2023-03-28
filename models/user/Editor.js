const { default: mongoose, Mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const editorSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "User" },
  blog_ids: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const Editor = mongoose.model("Editor", editorSchema);
module.exports = Editor;
