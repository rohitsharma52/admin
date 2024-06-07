const mongoose = require('mongoose');
const order_2Schema=new mongoose.Schema({
          orderId:{
          type: String,
          required: true,
          },
          productId:{
          type: String,
          required: true,
          },
          quantity:{
          type: String,
          required: true,
          }, 
           
});

const Order_2 = mongoose.model('Order_2', order_2Schema);
module.exports=Order_2;   
