var express = require('express');
var router = express.Router();

var kidRouter = require('./kid');
var womenRouter = require('./women');
var menRouter = require('./men');
var shopRouter = require('./shop');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.use('/kid',kidRouter);
router.use('/women',womenRouter);
router.use('/men',menRouter);
router.use('/shop',shopRouter);


module.exports = router;
