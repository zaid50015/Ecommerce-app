const catchAsyncError = require("../middleware/catchAsyncError");
const { Category } = require("../model/Category");


exports.fetchCategories=catchAsyncError(async(req,res)=>{
    const categories=await Category.find({});
    res.status(200).json(categories);
})

exports.createCategory=catchAsyncError(async(req,res)=>{
    const category=await Category.create(req.body);
    res.status(201).json(category);
})