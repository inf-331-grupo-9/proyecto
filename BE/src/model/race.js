const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  organizer: { type: String, required: true },
  description: { type: String }
});

const RaceModel = mongoose.model('Race', raceSchema, "all_races");

module.exports = { RaceModel };
