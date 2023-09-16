//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// secret key



const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})


app.get("/register",function(req,res){
    res.render("register");
})


app.post("/register", function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    })

    newUser.save();
    res.render("secrets");
})


app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
});









app.listen(3000,function(){
    console.log("server started");
});