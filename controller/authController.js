const catchAsyncError = require("../middleware/catchAsyncError");
const { User } = require("../model/User");

exports.createUser= catchAsyncError(async(req,res)=>{
    const user=await User.create(req.body);
    res.status(201).json({id:user.id,role:user.role});
})
exports.loginUser=catchAsyncError(async(req,res)=>{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message:"Invalid credentails "})
      }

        const user=await User.findOne({email}).select("+password").exec();
      if (!user) {
        return  res.status(400).json({message:"User not found"})
      }
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return res.status(400).json({message:"Invalid email or password"});
      }
           
       return res.status(200).json({id:user.id,role:user.role});

})