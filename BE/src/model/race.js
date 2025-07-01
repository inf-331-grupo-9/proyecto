const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  organizer: { type: String, required: true },
  description: { type: String },
  rating: { 
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['on-going', 'cancelled'], default: 'on-going' }
});

const RaceModel = mongoose.model('Race', raceSchema, "all_races");

module.exports = { RaceModel };
