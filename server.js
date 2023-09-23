
require('dotenv').config({path:"./config/config.env"});
const app=require('./app');
const connectDB=require('./config/database')
connectDB();
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });





  const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
  });

  //handling unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error :${err}`);
    console.log("Shutting down the server due to unhandled promise rejection")
    server.close(()=>{
        process.exit(1)
    })
})