var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('privacy', {
        siteName: 'Your Store Name',
        minAge: '13',
        privacyEmail: 'privacy@yourstore.com',
        companyAddress: '123 Fashion Street, City, Country',
        lastUpdated: 'December 29, 2024'
    });
});

module.exports = router;
