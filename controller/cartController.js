const catchAsyncError = require("../middleware/catchAsyncError");
const { Cart } = require("../model/Cart");


exports.addToCart=catchAsyncError(async(req,res)=>{
    const cartItem=await (await Cart.create(req.body)).populate('product');
    res.status(201).json(cartItem);
})


exports.fetchCartByUser=catchAsyncError(async(req,res)=>{
    const{user}=req.query;
    const cart=await Cart.find({user}).populate('product');
    res.status(200).json(cart);
})



exports.updateCart=catchAsyncError(async(req,res)=>{
    const {id}=req.params;
   let updatedItem=await Cart.findByIdAndUpdate(id,req.body,{new:true}).populate('product');
  res.status(200).json(updatedItem)
})
  
  
  exports.deleteItemFromCart=catchAsyncError(async(req,res)=>{
    const {id}=req.params;
    const deletedItem=await Cart.findByIdAndDelete(id);
    res.status(200).json(deletedItem)
  })
  