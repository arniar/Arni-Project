var express = require('express');
var router = express.Router();
const User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    let detail ={
        emailOrPhone:req.session.value, 
    }
    let error = req.session.error || null; // Retrieve error message from session, if any
    req.session.error = null; // Clear error after use
    let emailError = req.session.emailError || null; // Retrieve error message from session, if any
    req.session.emailError = null; // Clear error after use
    
  res.render('login',{detail,error,emailError});
});

router.post('/loginAuth', async function(req, res) {
    req.session.value = req.body.emailOrPhone;
    req.session.password = req.body.password;
    console.log(req.body);

    try {
        let user;

        if (isNaN(req.session.value)) {
            user = await User.findOne({ email: req.session.value });
        } else {
            user = await User.findOne({ phone: req.session.value });
        }

        if (!user) {
            console.log("user not found")
            req.session.emailError = "User not found";
            return res.send("new")
        }

        const isMatch = await user.comparePassword(req.session.password);
        console.log("Password Match:", isMatch);

        if (isMatch) {
            console.log("Authentication Successful!");
            delete req.session.username;
            delete req.session.phone;
            delete req.session.email;
            delete req.session.password;
            delete req.session.value;
            return res.send("done");

        } else {
            req.session.error = "Invalid credentials";
            return res.send("undone");
        }
    } catch (err) {
        console.error("Error during login:", err);
        req.session.error = err.message || "Internal Server Error";
        return;
    }
});


module.exports = router;
