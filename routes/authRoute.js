const express = require("express");
const { createUser, loginUser, CheckUser } = require("../controller/authController");
const passport = require("passport");
const router=express.Router();
router.route('/signup').post(createUser);
router.route('/login').post(passport.authenticate('local'),loginUser)
router.route('/check').get(passport.authenticate('jwt'),CheckUser)

module.exports=router;