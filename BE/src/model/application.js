const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  raceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Race', required: true },
  runnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  runnerName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['on-going', 'cancelled'], 
    default: 'on-going' 
  },
  appliedAt: { type: Date, default: Date.now }
});

// Ensure one application per runner per race
applicationSchema.index({ raceId: 1, runnerId: 1 }, { unique: true });

const ApplicationModel = mongoose.model('Application', applicationSchema);

module.exports = { ApplicationModel }; 