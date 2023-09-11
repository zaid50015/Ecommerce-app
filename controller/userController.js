const catchAsyncError = require("../middleware/catchAsyncError");
const { User } = require("../model/User");

exports.fetchUserById=catchAsyncError(async(req,res)=>{
    const {id}=req.params
    const user=await User.findById(id);
    res.status(200).json(user)
})

exports.updateUser=catchAsyncError(async(req,res)=>{
    const {id}=req.params;
    const updatedUser=await User.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(updatedUser)
  })
  