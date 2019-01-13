const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const fs = require("fs");

const keys = require("./config/keys");
const messageRoutes = require("./routes/message");

const app = express();

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log("mongoDB connected"))
  .catch(error => console.log(error));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist/client"));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "dist", "client", "index.html")
    );
  });
}

module.exports = app;
