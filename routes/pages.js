"use strict";
var Page = require('../models/page.js');

exports.index = function(req, res) {
  let flash = {
    notice: req.flash('notice')[0],
    error: req.flash('error')[0]
  }

  Page.find(function(err, docs) {
    if (err) {
      flash.error = "There was an error locating your pages"
    }

    res.render("pages/index", {
      docs: docs,
      flash: flash,
      title: 'Reviews'
    });
  });
};

exports.about = function(req, res) {
  res.render("pages/about", {
    flash: {},
    title: 'About Page'
  })
};

exports.createForm = function(req, res) {
  res.render("pages/create", {
    flash: {},
    title: 'Create Page'
  })
}

exports.createSave = function(req, res) {
  var flash = {
        notice:req.flash('notice')[0],
        error:req.flash('error')[0]
  };
  
  var pages = new Page({
    course: req.body.course,
    professor: req.body.professor,
    difficulty: req.body.difficulty,
    description: req.body.description,
    ratingCourse: req.body.ratingCourse,
    ratingProfessor: req.body.ratingProfessor,
    question1: req.body.question1,
    question2: req.body.question2,
  })

  pages.save(function(err) {
    if (err) {
      flash.error="Page failed to save";
      res.render("pages/create", {
        flash: flash,
        title: 'Create Page'
      })
    }
    else {
      req.flash('notice', 'Page saved successfully!!');
      res.redirect('/');
    }
  });
}

exports.view = function(req, res) {
  let id = req.params.id || 0;
  Page.findById(id, function(err, docs) {
    if (err) {
      res.send("Document not found");
    }
    else {
      var flash = {
        notice: req.flash('notice')[0],
        error: req.flash('error')[0]
      };
      res.render('pages/read', {
        id: id,
        docs: docs,
        flash: flash,
        title: 'View Page'
      })
    }
  })
}

exports.update = function(req, res) {
  let id = req.params.id || 0;

  Page.findById(id, function(err, docs) {
    if (err) {
      res.send("Document not found");
    }
    else {
      res.render('pages/update', {
        id: id,
        docs: docs,
        flash: {},
        title: 'Update Page'
      })
    }
  })
}

exports.updateSave = function(req, res) {
  let id = req.params.id || 0;
  
  let flash = {
    notice: req.flash('notice')[0],
    error: req.flash('error')[0]
  };
  
  Page.findById(id, function(err, docs) {
    if (err) {
      res.send("Document not found");
    }
    else {
      docs.course = req.body.course;
      docs.professor = req.body.professor;
      docs.difficulty = req.body.difficulty;
      docs.description = req.body.description;
      docs.ratingCourse = req.body.ratingCourse;
      docs.ratingProfessor = req.body.ratingProfessor;
      docs.question1 = req.body.question1;
      docs.question2 = req.body.question2;
      docs.save(function(err) {
        if (err) {
          flash.error="Something is missing, Page failed to save";
          res.render('pages/update', {
            id: id,
            docs: docs,
            flash: flash,
            title: 'Update Page'
          })
        }
        else {
          req.flash('notice', 'Successfully updated!!');
          res.redirect('/pages/view/' + id);
        }
      })
    }
  })
}

exports.delete = function(req, res) {
  let id = req.params.id || 0;

  Page.findById(id, function(err, doc) {
    if (err) {
      res.send('document not found');
    }
    else {
      doc.remove(function(err) {
        if (err) {
          res.send("Error during deleting page");
        }
        else {
          res.redirect("/pages");
        }
      });
    }
  });
}

exports.search = function(req, res, next) {
  // if you find the same course from DB to searching data
  Page.find({course: req.body.search}, function(err, docs){
    if (err) {
      return next(err);
    }
    // if you can't find it, check the professor DB
    if(docs == ''){
      Page.find({professor: req.body.search}, function(err, docs){
        if(err){
          return next(err);
        }
        // if you can't find it too, show message
        if(docs == ''){
          res.render('pages/index', {title: 'Sorry'});
        }
        // if you find professor data, render it.
        else{
          res.render('pages/index', {docs: docs});
        }
      })
    }
    // if you find course data, render it.
    else{
      res.render('pages/index', {docs: docs});
    }
  });
};