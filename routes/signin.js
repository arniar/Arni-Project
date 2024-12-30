
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
var emailOtp = require('../utilities/emailOtp')
const generateRandomOTP = require('../utilities/generateOtp');



// 👉 **GET: Sign-in Page**
router.get('/', (req, res) => {
    let detail ={
        username: req.session.username,
        emailOrPhone:req.session.value, 
    }
    res.render('signin',{detail});
});

// 👉 **POST: Handle Email-or-Phone Sign-in**
router.post('/signinAuth', async (req, res) => {
    req.session.value= req.body.emailOrPhone;
    req.session.username=req.body.name;
    req.session.password=req.body.password;
    if(isNaN(req.session.value)){
        req.session.email=req.session.value;
        req.session.phone=null;
    }
    else{
        req.session.phone=req.session.value;
        req.session.email=null;
    }
    const user = await User.findOne({ email: req.session.email });
    console.log(user)
    if (user) {
      return res.send("already") ;
    }
     req.session.otp = await generateRandomOTP();
      emailOtp(req.session.otp, req.session.value);  // Send OTP to email or phone number
     setTimeout(() =>{
        delete req.session.otp;
        delete req.session.enteredOtp;
     },1000*60*60*10)
     res.send('done');
});


// 👉 **Google Authentication**
router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/signin' }),
   async  (req, res) => {
        // res.send({
        //     name: req.user.displayName,
        //     email: req.user.emails?.[0]?.value,
        //     photo: req.user.photos?.[0]?.value,
        // });
        req.session.username=req.user.displayName;
        req.session.email=req.user.emails?.[0]?.value;
        const user = await User.findOne({ email: req.session.email });
    console.log(user)
        if (user) {
        return res.redirect('/landing');
        }
        try {
            await User.create({
              username: req.session.username,
              phone: req.session.phone,
              email: req.session.email
            });
          } catch (err) {
            console.error('Error registering user:', err.message);
            req.session.error = 'Error registering user. Please try again.';
            return res.redirect('/signinOtp');
          }
    
          delete req.session.username; // Fixed typo
          delete req.session.phone;
          delete req.session.email;

    
          return res.redirect('/landing'); // Redirect to a success page
    }
);

// 👉 **Facebook Authentication**
router.get('/auth/facebook', 
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/signin' }),
   async (req, res) => {
        req.session.username=req.user.displayName;
        req.session.email=req.user.emails?.[0]?.value;
        const user = await User.findOne({ email: req.session.email });
    console.log(user)
        if (user) {
        return res.redirect('/landing');
        }
        try {
            await User.create({
              username: req.session.username,
              phone: req.session.phone,
              email: req.session.email
            });
          } catch (err) {
            console.error('Error registering user:', err.message);
            req.session.error = 'Error registering user. Please try again.';
            return res.redirect('/signinOtp');
          }
    
          delete req.session.name; // Fixed typo
          delete req.session.phone;
          delete req.session.email;

    
          return res.redirect('/landing'); // Re
    }
);

module.exports = router;
