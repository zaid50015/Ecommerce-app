const catchAsyncError = require("../middleware/catchAsyncError");
const { Product } = require("../model/Product");

//save bypasss the schema validation so not be using it
exports.createProduct = catchAsyncError(async (req, res) => {
  const product = new Product(req.body);
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  const doc = await product.save();
  res.status(201).json(doc);
});

exports.fetchAllProducts = catchAsyncError(async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
 let conditon={};
 if(!req.query.admin){
 conditon.deleted={$ne:true};
 }
  let products = Product.find(conditon);
  let totalProducts = Product.find(conditon);
  if (req.query.category) {
    products = products.find({ category: {$in:req.query.category.split(',')} });
    totalProducts = totalProducts.find({ category: {$in:req.query.category.split(',')} });
  }
  if (req.query.brand) {
    products = products.find({ brand: {$in:req.query.brand.split(',')} });
    totalProducts = totalProducts.find({ brand:{$in:req.query.brand.split(',')} });
  }

  if (req.query._sort && req.query._order) {
    products = products.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const pageNo = req.query._page;
    products = products.skip((pageNo - 1) * pageSize).limit(pageSize);
 
  }
  // console.log(products);
  const docs = await products.exec();
 totalProducts=await totalProducts.count().exec();
  res.set("X-Total-Count", totalProducts);

  res.status(200).json(docs);

  // await ke agar find ke saath use karoge to exec nahi kar paoge
});


exports.findProductById=catchAsyncError(async(req,res)=>{
  const {id}=req.params;
  const product=await Product.findById(id);
  res.status(200).json(product);
})

exports.updateProduct=catchAsyncError(async(req,res)=>{
  const {id}=req.params;
  const product=await Product.findByIdAndUpdate(id,req.body,{new:true});
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  const updatedProduct = await product.save()
  res.status(200).json(updatedProduct)
})