const express = require("express");
const app = express();
const passport = require('passport');
const cors = require("cors");
const productsRoute = require("./routes/productRoute");
const categoriesRoute = require("./routes/categoryRoute");
const brandsRoute = require("./routes/brandRoute");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");


const { intilizingPassport } = require("./config/passportConfig");
const { isAuth } = require("./services/common");


intilizingPassport(passport);



app.use(express.json());


app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session())


//Middlewares

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);



app.use("/products", isAuth(),productsRoute);
app.use("/categories",isAuth(), categoriesRoute);
app.use("/brands",isAuth(), brandsRoute);
app.use("/users",isAuth(), userRoute);
app.use("/auth", authRoute);
app.use("/cart", isAuth(),cartRoute);
app.use("/orders",isAuth(), orderRoute);





//Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error!");
});

module.exports = app;
