var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/admin-coupons', function(req, res, next) {
  res.render('adminCoupons');
});

router.post('/admin-coupons/table', async function (req, res, next) {
    let products = await Product.find({});
    console.log(products); // Verify fetched products in the console
    res.render('adminCoupons/table', { products }); // Pass as an object
});

module.exports = router;
