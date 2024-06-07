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
        const cart_data = await Cart.find().exec();
        res.locals.cart_count = cart_data.length; 
        next();
    } catch (err) {
        console.error(err);
        res.locals.cart_count = 0; 
        next();
    }
     }   
        
module.exports={
          isAuthenticated,LocalStrategy,fetchSliderData,cart_count,islogin
}        