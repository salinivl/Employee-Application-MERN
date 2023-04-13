const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://reachsalinivl:salinivl@cluster0.drrnktt.mongodb.net/EmployeeDB?retryWrites=true&w=majority',{
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
.then(()=>{
    console.log("Database is connected successfully");
})
.catch((error)=>{
    console.error("Error in connecting Database");
    console.log(error);
})
