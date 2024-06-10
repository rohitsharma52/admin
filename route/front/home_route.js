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
const Order_2=require('../../model/admin/order2_model.js')
const mongoose = require('mongoose');


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
  if (!Array.isArray(req.session.cart)) {
    req.session.cart = [];
  }
  const newCartItem = {
    product_id: req.body.product_id,
    quantity: req.body.quantity
  };
  req.session.cart.push(newCartItem);
  req.flash('success_msg', 'Your product has been added to the cart successfully');
  res.redirect('/front/shop');
}
catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/cart',auth.cart_count,async (req, res) => {
    try {
        const cart_data = req.session.cart
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
router.post('/delete_cart/:id', (req, res) => {
  const productId = req.params.id;
  try {
    if (!Array.isArray(req.session.cart)) {
      req.session.cart = [];
    }
    req.session.cart = req.session.cart.filter(item => item.product_id !== productId);
    req.flash('success_msg', 'Product removed from cart successfully');
    res.redirect('/front/cart');
  } catch (err) {
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
  let tempCart = null; // Initialize tempCart outside the authentication block

  passport.authenticate('local-user', (err, user, info) => {
      if (req.session.cart && req.session.cart.length > 0) {
          tempCart = req.session.cart; // Save session cart to a temporary variable
      }

      if (err) { return next(err); }
      if (!user) {
          req.flash('error_msg', info.message);
          return res.redirect('/front/login');
      }

      req.logIn(user, (err) => {
          if (err) { return next(err); }

          // Restore session cart after login
          if (tempCart) {
              req.session.cart = tempCart;
          }

          req.flash('success_msg', 'You are now logged in');
          return res.redirect('/front/view_address');
      });
  })(req, res, next);
});

  router.post('/update_quantity/:id', (req, res) => {
    const productId = req.params.id;
    const { quantity } = req.body;
    const quantityNumber = Number(quantity);
  
    try {
      // Ensure req.session.cart is initialized
      if (!Array.isArray(req.session.cart)) {
        req.session.cart = [];
      }
  
      // Find the product in the cart and update its quantity
      const cartItem = req.session.cart.find(item => item.product_id === productId);
      if (cartItem) {
        cartItem.quantity = quantityNumber;
        res.json({ success: true, data: cartItem });
      } else {
        res.status(404).json({ success: false, message: 'Product not found in cart' });
      }
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
router.get('/view_address',auth.cart_count,auth.islogin,auth.addToCart,async(req,res)=>{
  const user_id=req.user.id 
try{
const add_data=await Address.find({user_id:user_id}).exec()
res.render('front/view_address',{add_data:add_data})
}
catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.get('/add_address',auth.cart_count,auth.islogin,(req,res)=>{
  user_id=req.user.id
  
res.render('address/add_address',{user_id:user_id})
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
router.get('/checkout/:id',auth.cart_count,auth.islogin,auth.restoreGuestCart,async(req,res)=>{
  const id=req.params.id
  const user_id=req.user.id
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
res.render('front/checkout',{add_data:add_data,product_data,cartTotal,user_id:user_id})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});
router.post('/order_1', async (req, res) => {
  try {
    const { user_id, address_id, total_ammount, payment, product_ids, quantity } = req.body;

    // Step 1: Order_1 me insert karna
    const newOrder1 = new Order_1({
      user_id: user_id,
      address_id: address_id,
      total_ammount: total_ammount,
      payment: payment,
    });

    const savedOrder1 = await newOrder1.save();

    // Step 2: Order_2 me insert karna
    const order2Entries = product_ids.map((productId, index) => ({
      orderId: savedOrder1._id,
      productId: productId,
      quantity: quantity[index],
    }));

    await Order_2.insertMany(order2Entries);
    await Cart.deleteMany({ user_id: user_id });
    req.flash('success_msg', 'your order comfirm');
    res.redirect('/front/index');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/my_account',auth.islogin,auth.cart_count,async(req,res)=>{
  const user_id=req.user.id
  try{
    const user_data= await Register.findOne({_id:user_id})
    const order_1=await Order_1.find({user_id:user_id})
    res.render('front/my_account',{user_data:user_data,order_1:order_1})

  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // This may vary depending on your session cookie name
    res.redirect('/front/login');
  });
});
router.get('/view_order/:id',auth.cart_count,async(req,res)=>{
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
    res.render('front/view_order', { all_data });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }

})
module.exports=router;
