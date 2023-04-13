const mongoose = require('mongoose')

let EmpSchema=mongoose.Schema({
    name: String,
    designation: String,
    location: String,
    salary: Number
})

let Datamodel= mongoose.model('Employee',EmpSchema)

module.exports={Datamodel}