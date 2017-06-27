var express = require('express');
var User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) { // if(req.isAuthenticated())
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/login');
    }
}

// function validateForm(form, options) {
//   var name = form.name || "";
//   var email = form.email || "";
//   name = name.trim();
//   email = email.trim();

//   if (!name) {
//     return '이름을 입력해주세요.';
//   }

//   if (!email) {
//     return '이메일을 입력해주세요.';
//   }

//   if (!form.password && options.needPassword) {
//     return '비밀번호를 입력해주세요.';
//   }

//   if (form.password !== form.password_confirmation) {
//     return '비밀번호가 일치하지 않습니다.';
//   }

//   if (form.password.length < 6) {
//     return '비밀번호는 6글자 이상이어야 합니다.';
//   }

//   return null;
// }

/* GET users listing. */
router.get('/', needAuth, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('users/index', {users: users});
  });
});

router.get('/create', function(req, res, next) {
  res.render('users/create', {messages: req.flash()});
});

router.post('/create', function(req, res, next) {
  var flash = {
    notice:req.flash('notice')[0],
    error:req.flash('error')[0]
  }
  
  var users = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  users.save(function(err) {
    if (err) {
      flash.error="Page failed to save";
      res.render("users/create", {
        flash: flash,
        title: 'Create User'
      });
    }
    else {
      req.flash('notice', 'user saved successfully!!');
      res.redirect('/');
    }
  });
});

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if(err) {
      return next(err);
    }
    res.render('users/view', {user: user});
  });
});

module.exports = router;
