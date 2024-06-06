const mongoose = require('mongoose');
const cartSchema=new mongoose.Schema({
          product_id:{
          type: String,
          required: true,
          },
          quantity:{
          type: String,
          required: true,
          },  
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports=Cart;   
