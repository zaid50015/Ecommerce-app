const catchAsyncError = require("../middleware/catchAsyncError");
const { User } = require("../model/User");
const { sanitizeUser } = require("../services/common");
const jwt = require('jsonwebtoken');
exports.createUser = catchAsyncError(async (req, res) => {
  // if(await User.findOne({email:req.body.email})){
  //   res.status(401).json({message:"User with this email already exists"})
  // }
  const user = await User.create(req.body);  
  req.login(sanitizeUser(user), function (err) {  //this also calls serializer and adds to session
    if (err) {
      return res.status(400).json(err);
    }
    const token = jwt.sign({ foo: sanitizeUser(user) }, process.env.JWT_SECRET);
    res.status(201).json(sanitizeUser(user));
  });
});
exports.loginUser = async (req, res) => {
  res.status(201).json(req.user);
};
exports.CheckUser = async (req, res) => {
  res.status(201).json(req.user);
};
