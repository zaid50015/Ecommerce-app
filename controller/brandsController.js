const catchAsyncError = require("../middleware/catchAsyncError");
const { Brand } = require("../model/Brand");


exports.fetchBrands=catchAsyncError(async(req,res)=>{
    const brands=await Brand.find({});
    res.status(200).json(brands)
})

exports.createBrand=catchAsyncError(async(req,res)=>{
    const brand=await Brand.create(req.body);
    res.status(201).json(brand);
})