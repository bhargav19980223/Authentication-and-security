require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({
    extended: true
}))
//creating user schema!!
const userSchema = new mongoose.Schema({
    email:String,
    password:String
})
// to encrypt password we need to use plugins!!
userSchema.plugin(encrypt , {secret:process.env.SECRET, encryptedFields: ['password'] })
const User = new mongoose.model("User", userSchema)
// creating user data-base
mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("successful connection to db")
})
.catch((e)=>{
    console.log("problem in connection to db")
})



app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",(req,res)=>{
    const newuser = new User({
        email: req.body.username,
        password: req.body.password

    });
    newuser.save((err)=>{
        if(err){
            console.log("err")
        }else{
            // we dont want to render secret until user get register!!
            res.render("secrets")
            console.log("user mail and password saved sucessfulluy to database")
        }
    })

})
app.post("/login",(req,res)=>{
    const username = req.body.username
    const password =  req.body.password
    User.findOne({email:username},(err,found)=>{
        if(err){
            console.log(err)
        }else{
            if(found){
                if(found.password == req.body.password){
                    res.render("secrets");
                }
            }
        }
    })

})
// code to start our server at 3000!!
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});