const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.use(routes);

const port = 5000;
app.listen(port, () => {
  console.log(`server started`);
});
