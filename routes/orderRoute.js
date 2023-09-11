const express = require("express");
const { createOrder, fetchOrdertByUser, deleteOrder, updateOrder, fetchAllOrders } = require("../controller/orderController");
const router=express.Router();
router.route('/').post(createOrder).get(fetchAllOrders)
router.route('/user/:userId').get(fetchOrdertByUser);
router.route('/:id').delete(deleteOrder).patch(updateOrder)
module.exports=router;