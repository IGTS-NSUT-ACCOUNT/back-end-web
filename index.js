const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./routes/api/users");
const passport = require('passport');

require("dotenv").config();
const app = express();

connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: [
      "https://artisans-and-co-3s5c.onrender.com",
      "http://localhost:3000",
    ],
  })
);

// Login

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

app.use(routes);

const port = 5000;
app.listen(port, () => {
  console.log(`server started`);
});
