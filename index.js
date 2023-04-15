const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();
const app = express();

connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

// Pass the global passport object into the configuration function
require("./config/passport")(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Routes
app.use(routes);

const port = 5000;
app.listen(port, () => {
  console.log(`server started`);
});
