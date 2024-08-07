const express = require('express')
const router=express.Router();
const auth=require('../../auth.js')
const upload=require('../../file_upload.js')
const Category=require('../../model/admin/category_model.js')
const Product=require('../../model/admin/product_model.js')
const Order_1=require('../../model/admin/order_1.js')
const Register=require('../../model/admin/login_model.js')
const Order_2=require('../../model/admin/order2_model.js')

/////////////////////////// category route//////////////////////////////////
router.get('/add_category',auth.fetchSliderData,(req,res)=>{
          res.render('category/add_category')
          });
router.get('/view_category',auth.fetchSliderData,async(req,res)=>{
          try{
                const responce=await Category.find().exec();    
                res.render('category/view_category',{responce:responce})}
          catch (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                  }
          });
router.post('/add_category',upload.single('image'),async(req,res)=>{
    try{
      const get_data=req.body;
      const image = req.file ? req.file.path : '';
      const set_data=new Category({
          ...get_data,
          image:image,
      });
     const responce=await set_data.save();
     req.flash('success_msg', 'Your data insert sucessfull');

     res.redirect('/admin/view_category')

    }
    catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
         });
         router.get('/update_category/:id', auth.fetchSliderData, async (req, res) => {  
           const id=req.params.id;
   try{
        const responce=await Category.findOne({
          _id:id,
        }); 
      res.render('category/update_category',{responce:responce})   
   }
   catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
     })
     router.post('/update_category/:id', upload.single('image'),async(req,res)=>{
    const id=req.params.id
    const updateData = {
          ...req.body,
        };
        updateData.image = req.file.path;   
        try {
          const response = await Category.findByIdAndUpdate(id, updateData, { new: true });
          req.flash('success_msg', 'Your data update sucessfull');
          res.redirect('/admin/view_category'); // Redirect or send success response
        }
    catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
     });
     router.post('/delete_category/:id',async(req,res)=>{
          const id=req.params.id
          try{
           const responce=await Category.findByIdAndDelete(id);
           req.flash('success_msg', 'Your data delete sucessfull');

           res.redirect('/admin/view_category')
          }
          catch (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                  }
     })    
//////////////////////////product route////////////////////////////////////
router.get('/add_product', auth.fetchSliderData,async(req,res)=>{
  try{
    const responce= await Category.find().exec();
    res.render('product/add_product',{responce:responce})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/add_product', upload.array('images', 4), async (req, res) => {
  const get_data = req.body;
  const images = req.files.map(file => file.path); // Map the file paths
  const set_data = new Product({
    ...get_data,
    images
  });

  try {
    const response = await set_data.save();
    req.flash('success_msg','your data insert sucessfull');
    res.redirect('/admin/view_product');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/view_product', auth.fetchSliderData,async(req,res)=>{
  try{ const response=await Product.find().exec();
    res.render('product/view_product',{response:response})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.post('/delete_product/:id',async(req,res)=>{
  const id=req.params.id
 try{
      const response=await Product.findByIdAndDelete(id)
      req.flash('success_msg','your product delete sucessfull');
      res.redirect('/admin/view_product')
    }
 catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
});
router.get('/update_product/:id',auth.fetchSliderData,async(req,res)=>{
  const id =req.params.id
  try{
     const response=await Product.findOne({_id:id}).exec()
     res.render('product/update_product',{response:response})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/update_product/:id', upload.array('images', 4), async (req, res) => {
  const id = req.params.id;
  const get_data = req.body;
  const images = req.files.map(file => file.path);

  try {
      const response = await Product.findByIdAndUpdate(id, {
          ...get_data,
          images
      }, { new: true });
      req.flash('success_msg','your data update sucessfull');
      res.redirect('/admin/view_product');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
router.get('/all_orders',auth.fetchSliderData,async(req,res)=>{

  try {
    const orders = await Order_1.find().exec();
    const get_data = await Promise.all(orders.map(async (order) => {
        const user = await Register.findById(order.user_id).select('username').exec();
        return {
            ...order._doc,
            username: user ? user.username : 'Unknown User'
        };
    }));
    res.render('order/all_orders',{get_data:get_data})
} 
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
});
router.get('/view_order/:id',auth.fetchSliderData,async(req,res)=>{
  const order_id=req.params.id
  try {
    const order_data = await Order_2.find({ orderId: order_id });
    const all_data = await Promise.all(order_data.map(async (data) => {
      const product_data = await Product.findById(data.productId);
      const quantity = data.quantity;
      return {
        product_data,
        quantity
      };
    }));
    res.render('order/view_order', { all_data });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }

})

 module.exports=router;
