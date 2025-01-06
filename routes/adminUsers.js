var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.condition = req.query.condition||"All"
  console.log(req.session.condition)
  res.render('adminUsers');
});

router.post('/table', async function (req, res, next) {
  try {

    if(req.session.condition=="All"){
      let users = await User.find();
      return res.render('adminUsers/table', { users });
    }
      let users = await User.find({status: req.session.condition});
      console.log(users)
      return res.render('adminUsers/table', { users });
      
  } catch (error) {
      console.error('Error fetching users:', error);
      next(error); // Pass the error to the error handler
  }
});


module.exports = router;
