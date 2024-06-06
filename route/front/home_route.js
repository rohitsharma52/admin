const express = require('express')
const router=express.Router();
const Category=require('../../model/admin/category_model.js');
const Product=require('../../model/admin/product_model.js')
const Cart=require('../../model/admin/cart_model.js')
const auth=require('../../auth.js')
const Register=require('../../model/admin/login_model.js')
const passport=require('passport');
const Address=require('../../model/admin/address_model.js')
const Order_1=require('../../model/admin/order_1.js')

router.get('/index',auth.cart_count,async(req,res)=>{
try{
const category_data=await Category.find().exec()
const best_dealis = await Product.find({ best_dealis: 1 }).exec()
const exploreProduct=await Product.find({exploreProduct:1}).exec()
const mega_collection=await Product.find({mega_collection:1}).exec()
const weekly_dealis=await Product.find({weekly_dealis:1}).exec()


res.render('front/home',{category_data:category_data,best_dealis:best_dealis,exploreProduct:exploreProduct,
    mega_collection:mega_collection,weekly_dealis:weekly_dealis, isHomePage: true})
} 
catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
      }         
});
router.get('/shop/:id?',auth.cart_count,async(req,res)=>{
    const id = req.params.id
    try{
        if (id) {
        products = await Product.find({ category_id: id }).exec();
      } else {
        products = await Product.find().exec();
      }
      const category=await Category.find().exec()  
      res.render('front/shop',{products:products,category:category})
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/cart_data',async(req,res)=>{
try{
const get_data=req.body
const set_data=new Cart(get_data)
const response=await set_data.save()
req.flash('success_msg', 'Your Product cart sucessfull');
res.redirect('/front/shop')
}
catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/cart',auth.cart_count,async (req, res) => {
    try {
        const cart_data = await Cart.find().exec();
        const product_data = [];
        let cartTotal = 0;
      
        for (const data of cart_data) {
          const product = await Product.findById(data.product_id).exec();
      
          if (product) {
            const total = product.price * data.quantity;
            cartTotal += total;
            product_data.push({ 
              ...product._doc,
              quantity: data.quantity,
              total, 
              cartItemId: data._id
            });
          } else {
            console.warn(`Product with ID ${data.product_id} not found`);
          }
        }
        res.render('front/cart',{product_data:product_data,cartTotal:cartTotal})    
      } catch (error) {
        console.error('Error fetching cart or product data:', error);
      }
      
});
router.post('/delete_cart/:id',async(req,res)=>{
    const id=req.params.id
try{
  const response=await Cart.findOneAndDelete({product_id:id})
  req.flash('success_msg', 'Your Product delete sucessfull');
   res.redirect('/front/cart')
}
catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/login',(req,res)=>{
res.render('front/login')
});
router.get('/register',(req,res)=>{
    res.render('front/register')
    });
router.post('/register',async(req,res)=>{
try{
const get_data=req.body
const set_data=new Register(get_data)
const response=await set_data.save()
req.flash('success_msg', 'Your account created sucessfull');
res.redirect('/front/login')
}
catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
}) 
router.post('/login', (req, res, next) => {
    passport.authenticate('local-user', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('error_msg', info.message);
        return res.redirect('/front/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are now logged in');
        return res.redirect('/front/check_out')
      });
    })(req, res, next);
  });
  router.post('/update_quantity/:id', async (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body;
    const quantityNumber = Number(quantity);
    try {
        const updatedCart = await Cart.findByIdAndUpdate(id, { quantity: quantityNumber }, { new: true });
        res.json({ success: true, data: updatedCart });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/product_details/:id',auth.cart_count,async(req,res)=>{
    const id= req.params.id
  try{
   const view_product=await Product.findOne({_id:id}).exec()
   res.render('front/product_details',{view_product:view_product})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/view_address',auth.cart_count,async(req,res)=>{
try{
const add_data=await Address.find().exec()
res.render('front/view_address',{add_data:add_data})
}
catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/add_address',auth.cart_count,(req,res)=>{
res.render('address/add_address')
});
router.post('/add_address',async(req,res)=>{
  try{
    const get_data=req.body
    const set_data=new Address(get_data)
    const response= await set_data.save()
  res.redirect('/front/view_address')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/checkout/:id',auth.cart_count,async(req,res)=>{
  const id=req.params.id
  try{
    const add_data=await Address.findOne({_id:id})
    const cart_data = await Cart.find().exec();
    const product_data = [];
    let cartTotal = 0;
  
    for (const data of cart_data) {
      const product = await Product.findById(data.product_id).exec();
  
      if (product) {
        const total = product.price * data.quantity;
        cartTotal += total;
        product_data.push({ 
          ...product._doc,
          quantity: data.quantity,
          total, 
          cartItemId: data._id
        });
      } else {
        console.warn(`Product with ID ${data.product_id} not found`);
      }
    }
res.render('front/checkout',{add_data:add_data,product_data,cartTotal})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.post('/order_1',async(req,res)=>{
  console.log('hello work here')
try{
const get_data=req.body
const set_data=new Order_1(get_data)
const response= await set_data.save()
res.redirect('/front/index')
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})

module.exports=router;
