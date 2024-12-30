var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

/* GET reset password page. */
router.get('/', function(req, res, next) {
    res.render('resetPassword');
});

/* POST reset password confirmation. */
router.post('/resetPasswordConfirm', async function(req, res) {
    try {
        const newPassword = req.body.newPassword || req.body.password; // Support both field names
        console.log(newPassword)
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
         console.log(req.session.value)
        // Determine query based on session value
        const query = isNaN(req.session.value)
            ? { email: req.session.value }
            : { phone: req.session.value };
        console.log(query)
        // Update the user's password
        const result = await User.updateOne(query, { $set: { password: hashedPassword } });
        console.log(result)


        res.send("done");
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).send("An error occurred while resetting the password");
    }
});

module.exports = router;