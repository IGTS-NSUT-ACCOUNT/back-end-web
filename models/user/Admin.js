const { default: mongoose, Mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const adminSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "User" },
  blog_ids: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
