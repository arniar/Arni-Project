var express = require('express');
var router = express.Router();
var adminProductsRouter = require('./adminProducts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminDashboard');
});

router.use('/',adminProductsRouter)
module.exports = router;
