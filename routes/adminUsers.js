var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/admin-users', function(req, res, next) {
  res.render('adminUsers');
});

router.post('/admin-users/table', async function (req, res, next) {
    let products = await Product.find({});
    console.log(products); // Verify fetched products in the console
    res.render('adminUsers/table', { products }); // Pass as an object
});

module.exports = router;
