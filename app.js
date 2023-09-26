const express = require("express");
const app = express();
const passport = require('passport');
const cors = require("cors");
const cookieParser = require('cookie-parser')
const productsRoute = require("./routes/productRoute");
const categoriesRoute = require("./routes/categoryRoute");
const brandsRoute = require("./routes/brandRoute");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");


const { intilizingPassport } = require("./config/passportConfig");
const { isAuth } = require("./services/common");



//Middlewares
app.use(cookieParser())
app.use(express.json());
// app.use(express.static('build'))
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session())
app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
intilizingPassport(passport);


app.use("/products", isAuth(),productsRoute);
app.use("/categories",isAuth(), categoriesRoute);
app.use("/brands",isAuth(), brandsRoute);
app.use("/users",isAuth(), userRoute);
app.use("/auth", authRoute);
app.use("/cart", isAuth(),cartRoute);
app.use("/orders",isAuth(), orderRoute);


// Payments

// This is your test secret API key.

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

app.use(express.static("public"));
app.use(express.json());



app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;
console.log(totalAmount)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalAmount*100, //for decimal  
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});





//Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error!");
});

module.exports = app;
