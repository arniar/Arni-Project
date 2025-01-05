var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminUsers');
});

router.post('/table', async function (req, res, next) {
    let users = await User.find();
    res.render('/adminUsers/table',{users});
});

module.exports = router;
