const express=require('express')
const cors=require('cors')
const bodyparser=require('body-parser')
// const { Datamodel } = require('./model/datamodel')
const { Usermodel } = require('./model/usermodel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { Datamodel } = require('./model/datamodel')
const path = require('path');

const app=express()

app.use(cors())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname,'/build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname,'/build/index.html')); });



require('./database/empdb')

    app.post("/api/register", async(req,res)=>{
        try {
            
            const hashedPassword=await bcrypt.hash(req.body.password, 10)
            let data=new Usermodel({email:req.body.email, password:hashedPassword, fullname:req.body.fullname, jobtitle:req.body.jobtitle, username:req.body.username})
            const result=await data.save()
            console.log(result);
            res.status(200).json({"status":"success", "data":result})
            
        } catch (error) {
            console.log("Password was not hashed successfully"); 
            console.log(error);
            res.status(404).json(error)
            
        }


    })


app.post("/api/login-user", async(req,res)=>{
    try {     
       const user= await Usermodel.findOne({username:req.body.username})
       if (!user){
        return res.json({status: "Unauthorized", message: "Username not found",})
       
       }

       const passwordcheck=await bcrypt.compare(req.body.password, user.password)
       if(!passwordcheck){
        return res.json({status:"Unauthorized", message: "Password does not match"})
       }

       const token=jwt.sign({
        userId: user._id,
        userName: user.username,
       }, "emptoken",{expiresIn: "1d"})

       res.status(200).json({
        status: "Login Successful",
        // username: user.username,
        token:token,
      });
        
    } catch (error) {
        response.status(500).send({
          message: "Internal Server Error",
          error,
        });
      }
    });


    app.post("/api/admin-login", async(req,res)=>{
        const adminUser="admin"
        const adminPassword="$2b$10$e0m4ymkbaWicFGYhdYfMRujwqRo3/2lXZ.xLsiGV0tQm8q8RQ2BLK"  
        try {
             
           const username= req.body.username
           const password=req.body.password

           if (username != adminUser){
            return res.json({message:"Invalid Username"})
           }
           const passwordcheck=await bcrypt.compare(password, adminPassword)
           if(!passwordcheck){
             return res.json({message:"Password does not match"})
           }
           const token=jwt.sign({
            // userId: user._id,
            username: adminUser,
           }, "emptoken",{expiresIn: "1d"})
    
           res.status(200).json({
            message: "Login Successful",
            username: adminUser,
            token,
          });
            
        } catch (error) {
            res.json({
                message: "Internal Server Error",
                error,
              });
        }
    })
        
    app.post("/api/empdataEntry", async(req,res)=>{
      try {       
        const data = new Datamodel(req.body)      
          const result=await data.save()
          res.status(200).json({"status":"success","data":result})
      } catch (error) {
         console.log(error);
         res.status(400).json(error)
          
      }  


  })           
  
  app.post("/api/ViewallEmployees", async(req,res)=>{
    try {
        let data=await Datamodel.find()
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
       res.status(400).json(error)
    }
    
})


app.put("/api/updateEmployee/:id", async(req,res)=>{
  try {
    let item=req.body
   
let updatedata={$set:item}

let updatedEmployee=await Datamodel.findByIdAndUpdate({_id:req.params.id}, updatedata)
res.status(200).json('Employee data is updated successfully')
    
} catch (error) {
    console.log(error);
    res.json('Error in updating data!')  
}

})


app.delete("/api/deleteEmployee/:id", async(req,res)=>{
  try {
    const list= await Datamodel.findByIdAndDelete({ _id:req.params.id })
     res.status(200).json('Employee data is deleted successfully')
     
 } catch (error) {
     console.log(error.message);
     res.status(400).json('error.message')
 }
 })

app.listen(3001, (req,res)=>{
    console.log("Server is running on port 3001");
})