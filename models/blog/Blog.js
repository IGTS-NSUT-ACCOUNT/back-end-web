const { default: mongoose, Mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const blogSchema = new Schema(
  {
    title: String,
    thumbnail: String,
    content: String,
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],

    editor_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Editor",
    },

    subtopics: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Subtopic",
      },
    ],

    public: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: Number,
      default: 0,
    },
    liked_by: {
      type: Map,
      of: Boolean,
      default: new Map(),
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
