const mongoose = require('mongoose')

let SignupSchema=mongoose.Schema({
    fullname: String,
    email: String,
    jobtitle:String,        
    username: String,
    password: String
})

let Usermodel= mongoose.model('Registration',SignupSchema)

module.exports={Usermodel}