const mongoose = require('mongoose');
const productSchema=new mongoose.Schema({
          category_id:{
          type: String,
          required: true,
          },
          name:{
          type: String,
          required: true,
          },
          price:{
          type: String,
          required: true,
          },
          images: {
          type: [String], 
          required: true,
          },
          description:{
          type: String,
          required: true,
          },
          exploreProduct:{
          type: String,
          required: true,
          },
          weekly_dealis:{
          type: String,
          required: true,
          },
          best_dealis:{
          type: String,
          required: true,
          },
          mega_collection:{
          type: String,
          required: true,
          },
});

const Product = mongoose.model('Product', productSchema);
module.exports=Product;   
