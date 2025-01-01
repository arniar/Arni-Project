var express = require('express');
var router = express.Router();
var adminProductsRouter = require('./adminProducts');
var adminUsersRouter = require('./adminUsers');
var adminCategoryRouter = require('./adminCategory');
var adminCouponsRouter = require('./adminCoupons');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminDashboard');
});

router.use('/',adminProductsRouter)
router.use('/',adminUsersRouter)
router.use('/',adminCategoryRouter)
router.use('/',adminCouponsRouter)

module.exports = router;
