const express = require('express')
const app = express()
const auth=require('./route/admin_route.js')
const admin=require('./route/admin/all_route.js')
const front=require('./route/front/home_route.js')
const db=require('./db.js');
const path = require('path');
const bodyParser=require('body-parser')
const passport=require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const slider=require('./auth.js')
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(session({
          secret: 'your_secret_key',
          resave: false,
          saveUninitialized: false
        }));
        app.get('/logout', (req, res) => {
          req.session.destroy((err) => {
            if (err) {
              return res.redirect('/');
            }
            res.clearCookie('connect.sid'); // This may vary depending on your session cookie name
            res.redirect('/auth/login');
          });
        });             
app.use(passport.initialize());
app.use(passport.session());        
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(flash());
app.use((req, res, next) => {
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error'); // Passport sets 'error' flash message
  next();
}); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth',auth);
app.use('/admin',admin)
app.use('/front',front)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public'), 
));
app.use(slider.fetchSliderData);



const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

