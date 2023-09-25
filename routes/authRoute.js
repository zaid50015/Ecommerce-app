const express = require("express");
const { createUser, loginUser, checkAuth } = require("../controller/authController");
const passport = require("passport");
const router=express.Router();
router.route('/signup').post(createUser);
router.route('/login').post(passport.authenticate('local'),loginUser)
router.route('/checkAuth').get(passport.authenticate('jwt'),checkAuth)

module.exports=router;