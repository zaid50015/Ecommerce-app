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

  token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOnsiaWQiOiI2NGZlZWI4YTVkZjk5M2U0ZmFkZDAyNDIiLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNjk1NTY2OTUwfQ.lxRwNQhRoCllDICP3SNypsr5X1f94_hb9M5w3zlfpbE"
  return token;
};
