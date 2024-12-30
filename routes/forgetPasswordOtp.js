var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const value = req.session.value; 
  let error = req.session.error || null; 
  req.session.error = null; 
  res.render('forgetPasswordOtp', { value, error });
});

router.post('/verify-otp', function(req, res, next) {
    try {
      // Ensure the OTP and session OTP exist
      if (!req.session.otp) {
        req.session.error = 'Session expired. Please request a new OTP.';
        return res.redirect('/forgetPasswordOtp');
      }
  
      // Combine entered OTP from req.body
      req.session.enteredOtp = Object.values(req.body).join("").trim();
      console.log(req.session.enteredOtp);
      console.log(req.session.otp);
  
      // Compare entered OTP with session OTP
      if (req.session.enteredOtp === req.session.otp) {
        return res.redirect('/resetPassword');
      } else {
        req.session.error = 'Invalid OTP. Please try again.';
        return res.redirect('/forgetPasswordOtp');
      }
  
    } catch (error) {
      console.error('Error in OTP verification:', error);
      req.session.error = 'Something went wrong. Please try again.';
      return res.redirect('/forgetPasswordOtp');
    }
  });
  
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