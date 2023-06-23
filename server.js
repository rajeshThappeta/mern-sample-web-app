//create express app
const exp=require('express');
const app=exp();

const userApp=require('./apis/userApi')
const productApp=require('./apis/productApi')
const path=require('path')


//connect react build with express server
app.use(exp.static(path.join(__dirname,'./build')))

//get MongoClient
const mclient=require("mongodb").MongoClient;
//connect to MongoDB server using MongoClient
mclient.connect('mongodb://127.0.0.1:27017/sampledb')
.then(client=>{
    //get DB object
    const db=client.db('sampledb')
    //get users collection obj
    const usersCollection=db.collection('users')
     //get users collection obj
     const productsCollection=db.collection('products')
    //share to usersApi
    app.set('usersCollection',usersCollection)
    //share to usersApi
    app.set('productsCollection',productsCollection)
    console.log("DB connect success")

})
.catch(err=>console.log("err in db connect",err))


//when path starts with user-api, then forward to userApp
app.use('/user-api',userApp)
//when path starts with product-api, then forward to userApp
app.use('/product-api',productApp)


//page refresh
app.use('*',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'./build/index.html'))
})


//handling invalid paths
app.use((req,res,next)=>{
    res.send({message:`The path ${req.url} is invalid`})
})


//error handling middleware
app.use((err,req,res,next)=>{
    res.send({message:"error",reason:err.message})
})

//assign port 
app.listen(4000,()=>console.log('web server listening on port 4000..'))






