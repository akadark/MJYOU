var express = require('express');
var Page = require('../models/page');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
})

router.get('/login', function(req, res, next) {
  res.render('login');
})

router.post('/login', function(req, res, next) {

})

router.get('/logout', function(req, res, next) {
  req.flash('success', '로그아웃 되었습니다.');
  req.redirect('/');
})

module.exports = router;