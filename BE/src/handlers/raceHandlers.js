const { RaceModel } = require('../model/race');

const getAllRaces = (query = {}) => RaceModel.find(query);
const createRace = (data) => new RaceModel(data).save();
const getRaceById = (id) => RaceModel.findById(id);
const updateRace = (id, data) => RaceModel.findByIdAndUpdate(id, data, { new: true });
const deleteRace = (id) => RaceModel.findByIdAndDelete(id);

// Get races created by a specific enterprise
const getRacesByEnterprise = (enterpriseId) => RaceModel.find({ createdBy: enterpriseId });

module.exports = {
  getAllRaces,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  getRacesByEnterprise
};