const express = require("express");
const { fetchBrands, createBrand } = require("../controller/brandsController");
const router=express.Router();
router.route('/').get(fetchBrands).post(createBrand)
module.exports=router;