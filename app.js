const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const WebSocket = require('ws');
require("dotenv").config();
const app = express();

connectDB();

app.use(express.json({
  limit: "50mb"
}));
app.use(express.urlencoded({
  limit: "50mb",
  extended: true
}));
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONT_END_URL,
  })
);
console.log(process.env.FRONT_END_URL)

// Pass the global passport object into the configuration function
require("./config/passport")(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Routes
app.use((req, res, next) => {
  req.app.set("wss", wss); // Attach the wss to req.app
  next();
});
app.use(routes);

const port = process.env.PORT || 5005;



const server = app.listen(port, () => {
  console.log(`server started`);
});

const wss = new WebSocket.Server({
  server
});


// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
});