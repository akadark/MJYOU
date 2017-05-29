var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
  
var difficulty = ['Very easy', 'Easy', 'Normal', 'Hard', 'Very hard'];
var rating = ['★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'];

var ReviewSchema = new Schema({
  course:{
    type: String,
    required: true,
    unique: true
  },
  professor:{
    type: String,
    required: true,
    unique: true
  },
  description:{
    type: String,
    required: true
  },
  difficulty:{
    type: String,
    required: true,
    enum: difficulty
  },
  ratingCourse:{
    type: String,
    required: true,
    enum: rating
  },
  ratingProfessor:{
    type: String,
    required: true,
    enum: rating
  },
  question1:{
    type: String,
    required: true,
  },
  question2:{
    type: String,
    required: true,
  }
});

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;