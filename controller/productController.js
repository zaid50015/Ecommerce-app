const catchAsyncError = require("../middleware/catchAsyncError");
const { Product } = require("../model/Product");

//save bypasss the schema validation so not be using it
exports.createProduct = catchAsyncError(async (req, res) => {
  const product = new Product(req.body);
  const doc = await product.save();
  res.status(201).json(doc);
});

exports.fetchAllProducts = catchAsyncError(async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}

  let products = Product.find();

  let totalProducts = Product.find({});
  if (req.query.category) {
    products = products.find({ category: req.query.category });
    totalProducts = totalProducts.find({ category: req.query.category });
  }
  if (req.query.brand) {
    products = products.find({ brand: req.query.brand });
    totalProducts = totalProducts.find({ brand: req.query.brand });
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
  const updatedProduct=await Product.findByIdAndUpdate(id,req.body,{new:true});
  res.status(200).json(updatedProduct)
})