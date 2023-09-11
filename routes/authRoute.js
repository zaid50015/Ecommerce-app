const express = require("express");
const { createUser, loginUser } = require("../controller/authController");
const router=express.Router();
router.route('/signup').post(createUser);
router.route('/login').post(loginUser)

module.exports=router;