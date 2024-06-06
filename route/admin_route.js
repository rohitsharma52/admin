const express = require('express')
const router=express.Router();
const bcrypt = require('bcryptjs');
const Login=require('../model/login_model.js')
const Admin=require('../model/admin_model.js')
const multer = require('multer');

const passport=require('passport');
const flash = require('connect-flash');
const upload=require('../file_upload.js')
const auth=require('../auth.js')

router.get('/home',auth.isAuthenticated,auth.fetchSliderData, (req, res) => {
          res.render('home');
      });
      router.post('/login', (req, res, next) => {
        passport.authenticate('local-admin', (err, user, info) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/auth/login');
          }
          req.logIn(user, (err) => {
            if (err) { return next(err); }
            req.flash('success_msg', 'You are now logged in');
            return res.redirect('/auth/home');
          });
        })(req, res, next);
      });
      
        router.get('/login',(req,res)=>{
          res.render('login', { messages: req.flash('error') });
        })
 router.get('/register',(req,res)=>{
res.render('register')
 });

 router.get('/view_users',auth.isAuthenticated, async (req, res) => {
  try {
    const users = await Login.find().exec();
    res.render('view_users', { users: users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/old_register', upload.single('image'), async(req, res) => {
  try {
    const get_data = req.body;
    const imagePath = req.file ? req.file.path : '';
    const set_data = new Login({
      ...get_data,
      imagePath: imagePath // Add image path to the user data
    });

    const response = await set_data.save();
    req.flash('success_msg', 'Your account create success');
    res.redirect('/auth/login');
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



 router.post('/delete_user',async(req,res)=>{
const id=req.body.userId;
try{
  const response=await Login.findByIdAndDelete({_id:id});
  res.redirect('/auth/view_users');
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
 });
 router.get('/update_user/:id',async(req,res)=>{
const id=req.params.id;
try{
  const response=await Login.findOne({_id:id}).exec();
  res.render('update_user',{responce:response})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
 });
 router.post('/update_user/:id',async(req,res)=>{
  const id=req.params.id;
try{
  const updatedUser = await Login.findByIdAndUpdate(
    id,
    {
      username: req.body.username,
    },
    { new: true }
  );
   res.redirect('/auth/view_users'); 
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
 })
 ////////////////////////////////////////// here we start slider code///////////////////////////////////////
 router.get('/add_slider',auth.fetchSliderData,(req,res)=>{
  res.render('slider/add_slider');
 });
 router.post('/add_slider',upload.none(),async(req,res)=>{
  try{
    const get_data=req.body;
    const set_data=new Admin(get_data);
    const responce=await set_data.save();
    res.redirect('/auth/home');
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
 });
 
 
 module.exports=router;
