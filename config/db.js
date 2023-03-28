const { default: mongoose } = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASS}@cluster0.05efdbm.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Connection Successful");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

module.exports = connectDB;
