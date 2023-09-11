const express = require("express");
const { addToCart, fetchCartByUser, deleteItemFromCart, updateCart } = require("../controller/cartController");
const router=express.Router();
router.route('/').post(addToCart).get(fetchCartByUser);
router.route('/:id').delete(deleteItemFromCart).patch(updateCart)
module.exports=router;