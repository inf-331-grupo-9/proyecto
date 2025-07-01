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
  }
});

const RaceModel = mongoose.model('Race', raceSchema, "all_races");

module.exports = { RaceModel };
