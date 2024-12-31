var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/admin-products', function(req, res, next) {
  res.render('adminProducts');
});

router.post('/admin-products/table', async function (req, res, next) {
    let products = await Product.find({});
    console.log(products); // Verify fetched products in the console
    res.render('adminProducts/table', { products }); // Pass as an object
});

module.exports = router;
