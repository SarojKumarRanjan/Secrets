//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// secret key

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt
    .hash(req.body.password, saltRound)

    .then((hash) => {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });

      newUser.save();
      res.render("secrets");
    })

    .catch((err) => {
      console.error("Error:", err);
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt
          .compare(password, foundUser.password)
          .then((isMatch) => {
            if (isMatch) {
              res.render("secrets");
            } else {
              // Password doesn't match
              res.render("login"); // You can render the login page again or redirect as needed
            }
          })
          .catch((err) => {
            console.error("Error comparing passwords:", err);
            res.render("login"); // Handle the error by rendering the login page again
          });
      } else {
        // User not found
        res.render("login"); // You can render the login page again or redirect as needed
      }
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.render("login"); // Handle the error by rendering the login page again
    });
});

app.listen(3000, function () {
  console.log("server started");
});
