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
const path=require('path');
const { Order } = require("./model/Order");
const endpointSecret = process.env.END_POINT_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.paymentStatus = 'received';
      await order.save()
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.send();
});


//Middlewares

app.use(cookieParser())
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'build')));
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
// this line we add to make react router work in case of other routes doesnt match
app.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);

// Payments

// This is your test secret API key.

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount ,orderId} = req.body;
console.log(totalAmount)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalAmount*100, //for decimal  
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
     orderId
      //this info will go to stripe thenn to our webhook
      // so we can conclude thath the payment was sucessfull even if the clinet closees the window after pay
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

//WEB HOOK
//TODO : CAPTURE ACTUAL ORDER




//Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error!");
});

module.exports = app;
