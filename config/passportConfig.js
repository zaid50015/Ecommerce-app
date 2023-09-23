const { User } = require("../model/User");
const { sanitizeUser } = require("../services/common");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

exports.intilizingPassport = (passport) => {
  //Local strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function (
      email,
      password,
      done
    ) {
      try {
        const user = await User.findOne({ email: email })
          .select("+password")
          .exec();

        if (!user) {
          done(null, false, { message: "Invalid Credentails" });
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
          done(null, false, { message: "Invalid Credentails" });
        } else {
          const token = jwt.sign(
            { foo: sanitizeUser(user) },
            process.env.JWT_SECRET
          );
            done(null, { id: user.id, role: user.role });  //this calls a serializer
        }
      } catch (error) {
        done(error);
      }
    })
  );
 

  //JWT Statregy
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {

      try {
        const user = await User.findOne({ id: jwt_payload.sub });
        if (user) {
          return done(null, sanitizeUser(user));
        } else {
          return done(null, false);
          // or you could create a new account
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
     console.log(user)
      return cb(null, { id: user.id, role: user.role })
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
