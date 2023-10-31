const express = require("express");
const {
  createUser,
  loginUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
  logOutUser,
} = require("../controller/authController");
const passport = require("passport");

const router = express.Router();
router.route("/signup").post(createUser);
router.route("/login").post(passport.authenticate("local"), loginUser);
router.route("/checkAuth").get(passport.authenticate("jwt"), checkAuth);
router.route("/reset-password-request").post(resetPasswordRequest);
router.route("/reset-password").post(resetPassword);
router.route('/logout').get(logOutUser)

module.exports = router;
