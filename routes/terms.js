var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('terms', {
        siteName: 'Your Store Name',
        currency: 'USD',
        returnPeriod: '30',
        contactEmail: 'support@yourstore.com',
        contactPhone: '+1 (555) 123-4567',
        lastUpdated: 'December 29, 2024'
    });
});

module.exports = router;
