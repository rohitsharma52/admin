const mongoose = require('mongoose');
const adminSchema=new mongoose.Schema({
          name:{
          type: String,
          required: true,
          },
          nav_1:{
          type: String,
          required: true,
          },
          nav_1_link:{
          type: String,
          required: true,
          },
          nav_2:{
          type: String,
          required: true,
          }, 
          nav_2_link:{
          type: String,
          required: true,
          },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports=Admin;   