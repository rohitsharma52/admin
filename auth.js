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
        const userId = req.user._id;
        
        // Loop through each product in session cart
        for (const cartItem of req.session.cart) {
          // Create a new instance of CartItem
          const newCartItem = new Cart({
            user_id: userId,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity
          });
          await newCartItem.save();
        }
        
        // Clear session data
        req.session.cart = [];
        
        next();
      } catch (error) {
        // Handle error
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    // Middleware to restore session cart data if guest user
const restoreGuestCart = (req, res, next) => {
  console.log('hello this middel where')
  if (!req.isAuthenticated()) { 
    if (Array.isArray(req.session.cart) && req.session.cart.length > 0) { // If session cart data exists
      // Redirect to /front/shop if session cart data doesn't exist
      return;// Clear session cart data
    } else {
      res.redirect('/front/shop');
    }
  }
  next(); // Move to next middleware
};

    




module.exports={
          isAuthenticated,LocalStrategy,fetchSliderData,cart_count,islogin,addToCart,restoreGuestCart
}        