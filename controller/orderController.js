const catchAsyncError = require("../middleware/catchAsyncError");
const { Order } = require("../model/Order");



exports.createOrder=catchAsyncError(async(req,res)=>{
    const order=await Order.create(req.body);
    res.status(201).json(order);
})


exports.fetchOrdertByUser=catchAsyncError(async(req,res)=>{
    const{userId}=req.params;
    const order=await Order.find({user:userId})
    res.status(200).json(order);
})



exports.updateOrder=catchAsyncError(async(req,res)=>{
    const {id}=req.params;
   let updatedOrder=await Order.findByIdAndUpdate(id,req.body,{new:true})
  res.status(200).json(updatedOrder)
})
  
  
  exports.deleteOrder=catchAsyncError(async(req,res)=>{
    const {id}=req.params;
    const deletedOrder=await Order.findByIdAndDelete(id);
    res.status(200).json(deletedOrder)
  })
  


  exports.fetchAllOrders = catchAsyncError(async (req, res) => {
    // filter = {"category":["smartphone","laptops"]}
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
  
    let orders = Order.find({deleted:{$ne:true}});
  
    let totalOrders = Order.find({deleted:{$ne:true}});
  
    if (req.query._sort && req.query._order) {
      orders = orders.sort({ [req.query._sort]: req.query._order });
    }
  
    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const pageNo = req.query._page;
      orders = orders.skip((pageNo - 1) * pageSize).limit(pageSize);
   
    }
    // console.log(products);
    const docs = await orders.exec();
   totalOrders=await totalOrders.count().exec();
    res.set("X-Total-Count", totalOrders);
  
    res.status(200).json(docs);
  
    // await ke agar find ke saath use karoge to exec nahi kar paoge
  });