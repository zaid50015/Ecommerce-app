const express = require("express");
const { fetchUserById, updateUser } = require("../controller/userController");
const router=express.Router();

router.route('/:id').get(fetchUserById).patch(updateUser);
module.exports=router;