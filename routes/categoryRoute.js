const express = require("express");
const { fetchCategories, createCategory } = require("../controller/categoriesController");
const router=express.Router();
router.route('/').get(fetchCategories).post(createCategory)
module.exports=router;