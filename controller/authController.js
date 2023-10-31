const catchAsyncError = require("../middleware/catchAsyncError");
const { User } = require("../model/User");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail = require("../services/sendEmail");
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
    const token = jwt.sign( sanitizeUser(user) , process.env.JWT_SECRET);
    res
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .json(sanitizeUser(user));
  });
});
exports.loginUser = async (req, res) => {
  const user = req.user
  res
  .cookie("jwt", user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  })
  .json({id:user.id,role:user.role});
};
exports.checkAuth = async (req, res) => {
  if(req.user){
    res.status(200).json(req.user);
  }
  else{
    res.sendStatus(401);
  }
};

exports.logOutUser = async (req, res) => {
  const user = req.user
  res
  .cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  .sendStatus(200);
};

exports.resetPasswordRequest=catchAsyncError(async(req,res)=>{
  const email=req.body.email;
  const user=await User.findOne({email:email})
  if(user){
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken=token;
    await user.save()
    const subject="Zapkart Reset Password Link";
    // const resetPasswordLink=`http://localhost:3000/reset-password?token=${token}&email=${email}`;
    const resetPasswordLink=`https://ecommerce-app-kohl-eta.vercel.app/reset-password?token=${token}&email=${email}`;
    const html=`<p>Click <a href='${resetPasswordLink}'>here</a> to reset your password</p>`;
    const info=await sendEmail({to:email,subject,html});
    res.json(info);
  }
  else{
    res.sendStatus(401)
  }
})

exports.resetPassword=catchAsyncError(async(req,res)=>{
  const {email,token,password}=req.body;
  const user=await User.findOne({email:email,resetPasswordToken:token}).select("+password")
  if(user){
    user.resetPasswordToken="",
    user.password=password
    await user.save()
    const subject="Password Updated Successfully";
    const html=`<p>Your Password has been updated</p>`;
    const info=await sendEmail({to:email,subject,html});
    res.json(info);
  }
  else{
    res.sendStatus(401)
  }
})

