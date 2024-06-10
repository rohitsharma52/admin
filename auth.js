const bcrypt = require('bcryptjs');
const Login=require('./model/login_model.js')
const Admin=require('./model/admin_model.js')
const Cart=require('./model/admin/cart_model.js')
const Register=require('./model/admin/login_model.js')
const passport=require('passport');
const flash = require('connect-flash');

const LocalStrategy = require('passport-local').Strategy;
passport.use('local-admin', new LocalStrategy(async (username, password, done) => {
  try {
    const admin = await Login.findOne({ username: username }).exec();
    if (!admin) {
      return done(null, false, { message: 'Username not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    admin.type = 'admin'; // Add a type property
    return done(null, admin);
  } catch (error) {
    console.error(error);
    return done(error);
  }
}));
passport.use('local-user', new LocalStrategy(async (username, password, done) => {
  try {
    const user = await Register.findOne({ email: username }).exec();
    if (!user) {
      return done(null, false, { message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }
    user.type = 'user'; // Add a type property
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
}));
passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user.type });
});

passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.type === 'admin') {
      user = await Login.findById(obj.id).exec();
    } else {
      user = await Register.findById(obj.id).exec();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});


function isAuthenticated(req, res, next) {
          if (req.isAuthenticated()) {
            return next();
          }
          res.redirect('/auth/login');
        }
      function islogin(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect('/front/login');
      }
        const fetchSliderData = async (req, res, next) => {
          try {
            if (req.user) { // Assuming JWT-based authentication
              const user = await Login.findById(req.user.id);
              res.locals.currentUser = user;
            }
            const sliders = await Admin.find({});
            res.locals.sliders = sliders;
            next();
          } catch (error) {
            next(error);
          }
        };
     const cart_count=async(req,res,next)=>{
      try {
        if (req.session.cart) {
          res.locals.cart_count = req.session.cart.length;
        } else {
          res.locals.cart_count = 0;
        }
        next();
    } catch (err) {
        console.error(err);
        res.locals.cart_count = 0; 
        next();
    }
     };   
     const addToCart = async (req, res, next) => {
      try {
        if (req.session.cart && req.session.cart.length > 0) {
       
        next();
      }else {
        req.flash('error', 'Your cart is empty.');
        res.redirect('/front/shop');
    }
      } catch (error) {
        // Handle error
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    // Middleware to restore session cart data if guest user
    const restoreGuestCart = async (req, res, next) => {
      try {
        if (req.session.cart && req.session.cart.length > 0) {
          const userId = req.user._id;
          const cartItems = req.session.cart.map(cartItem => ({
            user_id: userId,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity
          }));
          
          await Cart.insertMany(cartItems); // Insert multiple cart items at once
          
          req.session.cart = []; // Clear the session cart
          return next(); // Proceed to the next middleware or route handler
        } else {
          req.flash('error', 'Your cart is empty.');
          return res.redirect('/front/shop');
        }
      } catch (error) {
        // Handle error
        console.error('Error adding to cart:', error);
        req.flash('error', 'There was an error processing your cart.');
        return res.redirect('/front/shop');
      }
    };

    




module.exports={
          isAuthenticated,LocalStrategy,fetchSliderData,cart_count,islogin,addToCart,restoreGuestCart
}        