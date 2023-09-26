const catchAsyncError = require("../middleware/catchAsyncError");
const { User } = require("../model/User");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
exports.createUser = catchAsyncError(async (req, res) => {
  if(await User.findOne({email:req.body.email})){
    return res.status(401).json({message:"User with this email already exists"})
  }
  const user = await User.create(req.body);
  req.login(sanitizeUser(user), function (err) {
    //this also calls serializer and adds to session
    if (err) {
      return res.status(400).json(err);
    }
    const token = jwt.sign({ foo: sanitizeUser(user) }, process.env.JWT_SECRET);
    res
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .json(sanitizeUser(user));
  });
});
exports.loginUser = async (req, res) => {
  res
  .cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  })
  .json(req.user);
};
exports.checkAuth = async (req, res) => {
  if(req.user){
    res.status(200).json(req.user);
  }
  else{
    res.sendStatus(401);
  }
};
