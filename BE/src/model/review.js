const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  raceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Race', required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  comment: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure one review per user per race
reviewSchema.index({ raceId: 1, userId: 1 }, { unique: true });

// Update the updatedAt field on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = { ReviewModel }; 