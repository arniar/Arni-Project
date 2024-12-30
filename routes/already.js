var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let value = req.session.value;
  res.render('already',{value});
});

module.exports = router;
