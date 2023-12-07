
const mongoose = require('mongoose');

const bookReviewSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  reviewTitle: {
    type: String,
    required: true
  },
  // author: {
  //   type: String,
  //   // required: true
  // },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = bookReviewSchema;
