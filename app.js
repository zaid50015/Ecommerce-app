const express = require("express");
const app = express();
const cors = require("cors");
const productsRoute = require("./routes/productRoute");
const categoriesRoute = require("./routes/categoryRoute");
const brandsRoute = require("./routes/brandRoute");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoute");
const cartRoute = require("./routes/cartRoute");

//Middlewares
app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.json());

app.use("/products", productsRoute);
app.use("/categories", categoriesRoute);
app.use("/brands", brandsRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error!");
});
module.exports = app;
