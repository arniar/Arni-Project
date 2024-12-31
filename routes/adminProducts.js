var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin-products', function(req, res, next) {
  res.render('adminProducts');
});

router.post('/admin-products/table', function(req, res, next) {
  
})

module.exports = router;
