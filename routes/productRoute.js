const express = require("express");
const { createProduct, fetchAllProducts, findProductById, updateProduct } = require("../controller/productController");
const { Product } = require("../model/Product");
const router=express.Router();

router.route('/').post(createProduct).get(fetchAllProducts);
router.route('/:id').get(findProductById).patch(updateProduct);

module.exports=router;