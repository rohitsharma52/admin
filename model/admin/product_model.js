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
          default: null
          },
          weekly_dealis:{
          type: String,
          default: null
          },
          best_dealis:{
          type: String,
          default: null
          },
          mega_collection:{
          type: String,
          default: null
          },
          liked_product: {
          type: Boolean,
          default: null
}
});

const Product = mongoose.model('Product', productSchema);
module.exports=Product;   
