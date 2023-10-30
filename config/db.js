const { default: mongoose } = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const pass = YNeWM37hJSuVyeG5
    const username = igtsnsit
    const conn = await mongoose.connect(
      `mongodb+srv://${username}:${pass}@cluster0.05efdbm.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Connection Successful");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

module.exports = connectDB;
