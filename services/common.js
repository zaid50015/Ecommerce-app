const passport = require("passport");

exports.isAuth = () => {
  return passport.authenticate("jwt");
};
exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  // This is temporary for testing
console.log("jwt-token",token)

  // token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOnsiaWQiOiI2NGZlZWI4YTVkZjk5M2U0ZmFkZDAyNDIiLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNjk1NjM2NjcyfQ.d-nR-tk1rlvZkZFsx9GK6CLIV82NhekB7gHvBog0dq0"

  return token;
};
