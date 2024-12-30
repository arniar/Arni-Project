var express = require('express');
var router = express.Router();
var generateRandomOTP = require('../utilities/generateOtp');
var emailOtp = require('../utilities/emailOtp');
var User = require('../models/user'); // Import the User model

/* GET users listing. */
router.get('/', async function (req, res) {
  const value = req.session.value; // Get the email or phone from query params
  let error = req.session.error || null; // Retrieve error message from session, if any
  req.session.error = null; // Clear error after use

  // Render the signinOtp page with value and error
  res.render('signinOtp', { value, error });
});

/* POST route for OTP verification */
router.post('/verify-otp', async function (req, res) {
  console.log(req.session.otp);
  try {
    // Ensure the OTP and session OTP exist
    if (!req.session.otp) {
      req.session.error = 'Session expired. Please request a new OTP.';
      return res.redirect('/signinOtp');
    }

    // Combine entered OTP from req.body
    req.session.enteredOtp = Object.values(req.body).join("").trim();
    console.log(req.session.enteredOtp);
    console.log(req.session.otp);
    // Compare entered OTP with session OTP
    if (req.session.enteredOtp === req.session.otp) {
      // Clear OTP-related session data after successful verification
      delete req.session.otp;
      delete req.session.enteredOtp;
      console.log(req.session.username,req.session.value,req.session.phone,req.session.phone,req.session.password)
      try {
      
        await User.create({
          username: req.session.username,
          phone: req.session.phone,
          email: req.session.email,
          password: req.session.password
        });
      } catch (err) {
        console.error('Error registering user:', err.message);
        req.session.error = 'Error registering user. Please try again.';
        return res.redirect('/signinOtp');
      }

      delete req.session.username;
      delete req.session.phone;
      delete req.session.email;
      delete req.session.password;
      delete req.session.value;

      return res.redirect('/landing'); // Redirect to a success page
    } else {
      req.session.error = 'Invalid OTP. Please try again.';
      return res.redirect('/signinOtp');
    }
  } catch (error) {
    console.error('Error in OTP verification:', error);
    req.session.error = 'Something went wrong. Please try again.';
    return res.redirect('/signinOtp');
  }
});

/* POST route for resending OTP */
router.post('/resendOtp', async function (req, res) {
  try {
    req.session.otp = await generateRandomOTP();
    await emailOtp(req.session.otp, req.session.value);  // Send OTP to email or phone number
    console.log(req.session.otp)
    console.log(req.session.value)
    console.log(req.session.email)
    setTimeout(() =>{
       delete req.session.otp;
       delete req.session.enteredOtp;
    },1000*60*60*10)
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: 'Failed to resend OTP.' });
  }
});

module.exports = router;
