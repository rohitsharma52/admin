const mongoose = require('mongoose');

const order_1Schema = new mongoose.Schema({
  address_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
  total_ammount: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Order_1 = mongoose.model('Order_1', order_1Schema);
module.exports = Order_1;
