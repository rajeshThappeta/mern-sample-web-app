//create a mini-express app
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')

const verifyToken=require('./middlewares/verifyToken')
const cloudinary=require('cloudinary').v2;
const multer=require('multer');
const {CloudinaryStorage}=require('multer-storage-cloudinary')
require('dotenv').config()

//body parser
userApp.use(exp.json());


//UPLOAD IMAGE CONFIGURATIONS
//configure cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_NAME, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
//configure cloudinary storage
const cloudinaryStorage=new CloudinaryStorage({
  cloudinary:cloudinary,
  params:async(req,file)=>{
    return{
      folder:'cr003',
      public_id:'photo-'+Date.now()
    }
  }
})
//configure multer
const upload=multer({storage:cloudinaryStorage})



//USER API

//read all users
userApp.get("/users", expressAsyncHandler(async (req, res) => {
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
  //get users
  let users = await usersCollection.find({status:true}).toArray();
  //send res
  res.send({ message: "all users", payload: users });
}));

//read one user by username
userApp.get("/users/:username", expressAsyncHandler(async (req, res) => {
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
  //get id from url
  let usernameFromUrl = req.params.username;
  //get user by id
  let user = await usersCollection.findOne({ username: usernameFromUrl ,status:true});
  //send res
  res.send({ message: "one user", payload: user });
}));

//create user
userApp.post("/user", upload.single('photo'),expressAsyncHandler(async (req, res) => {
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
  //get newUser from client
  let newUser = JSON.parse(req.body.newUser);
  //check if any user already existed with same username of newUser
  let user = await usersCollection.findOne({ username: newUser.username });
  //if user existed
  if (user !== null) {
    res.status(200).send({ message: "Username has already taken..plz choose another" });
  } else {
    //add status property to newUser
    newUser.status=true;
    //hash the password
    let hashedPassword = await bcryptjs.hash(newUser.password, 5);
    //replace plain password with hashesPassword
    newUser.password = hashedPassword;
    //add image address received from cloudinary to newUser
    newUser.profileImage=req.file.path;
    //insert to DB
    await usersCollection.insertOne(newUser);
    res.status(201).send({ message: "User created" });
  }
}));


//user login
userApp.post('/user-login',expressAsyncHandler(async(req,res)=>{
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
 //get user credentials
 let userCred=req.body;

 //verifuy username
 let user=await usersCollection.findOne({username:userCred.username})
 //if user i not found
 if(user===null){
   res.status(200).send({message:"Invalid username"})
 }
 //if username matched, then compare passwords
 else{
   //compare passwords
  
   let result=await bcryptjs.compare(userCred.password,user.password) 
   console.log(result)
   //if passwords not matched
   if(result===false){
     res.status(200).send({message:"Invalid password"})
   }//if passwords also matched
   else{
     //create a token
     let signedToken=jwt.sign({},process.env.SECRET,{expiresIn: 20})
     //send token in res
     res.status(200).send({message:"login success",token:signedToken,currentUser:user})
   }
 }
}))





//update user by username
userApp.put("/user/:username", expressAsyncHandler(async (req, res) => {
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
  //get username from client
  let usernameOfClient = req.params.username;
  //get modified user from client
  let modifiedUser = req.body;
  //update user in DB
  let dbres = await usersCollection.updateOne(
    { username: usernameOfClient },
    { $set: { ...modifiedUser } }
  );

  res.send({ message: "user modified" });
}));



//delete user by username
userApp.delete("/user/:username", expressAsyncHandler(async(req, res) => {
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
  //get username from client
  let usernameFromUrl=req.params.username;
  //delete a user by updating status to false
  await usersCollection.updateOne({username:usernameFromUrl},{$set:{status:false}})
  //send res
  res.send({message:"User deleted"})
}));


//restore user by username
userApp.get("/restore-user/:username", expressAsyncHandler(async(req, res) => {
  //get usersCollection obj
  const usersCollection = req.app.get("usersCollection");
  //get username from client
  let usernameFromUrl=req.params.username;
  //delete a user by updating status to false
  await usersCollection.updateOne({username:usernameFromUrl},{$set:{status:true}})
  //send res
  res.send({message:"User restored"})
}));



//protected route
userApp.get('/test-private',verifyToken,expressAsyncHandler((req,res)=>{
  res.send({message:"This is private info"})
}))
//export
module.exports = userApp;
