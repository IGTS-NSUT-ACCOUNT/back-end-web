const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const WebSocket = require('ws');
const {
  createServer
} = require("http");
require("dotenv").config();
const app = express();

connectDB();

//for meta helmet
app.use(require('prerender-node').set('prerenderToken', '4f4YkHFvjA6Ef2FQCYPd'));


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
    origin: '*', //https://igts-web.netlify.app
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



const server = createServer(app);


const wss = new WebSocket.Server({
  server,
});


// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
});

server.on('listening', () => {
  console.log('WebSocket server started');
});

server.listen(port, () => {
  console.log('Listenning');
})