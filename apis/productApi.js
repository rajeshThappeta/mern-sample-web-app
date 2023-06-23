//create mini-express app
const exp=require('express');
const productApp=exp.Router();


productApp.get('/products',async(req,res)=>{
    let productsCollection=req.app.get('productsCollection')
    //get products
    let products=await productsCollection.find().toArray()
    //send res
    res.send({message:'all products',payload:products})
})


//read all products
//read product by productId
//create new product
//update a product by id
//delete a product by is

module.exports=productApp;