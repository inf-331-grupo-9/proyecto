const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  raceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Race', required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure one rating per user per race
ratingSchema.index({ raceId: 1, userId: 1 }, { unique: true });

const RatingModel = mongoose.model('Rating', ratingSchema);

module.exports = { RatingModel }; 