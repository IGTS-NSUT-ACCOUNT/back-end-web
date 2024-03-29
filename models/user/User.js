const { default: mongoose, Mongoose } = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    // add a profile picture

    pfp_url: {
      type: String,
      required: false,
    },

    name: {
      first_name: String,
      last_name: { type: String, required: true },
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
      match:
        /^\+?[0-9]{1,3}?[-.\s]?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}$/,
    },

    verifytoken: {
      type:String
    },
    organization: {
      type: String,
    },

    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: ["REGULAR", "ADMIN", "EDITOR"],
      default: "REGULAR",
    },
    society_member:{
      type:Boolean,
      default:false,
    },
    readingList: [{ type: mongoose.Types.ObjectId, ref: "Blog" }],
    registered_events:[
      {
        type:mongoose.Types.ObjectId,
        ref:'Event'
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
