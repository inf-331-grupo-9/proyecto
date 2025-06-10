const { RaceModel } = require('../model/race');

const getAllRaces = (query = {}) => RaceModel.find(query);
const createRace = (data) => new RaceModel(data).save();
const getRaceById = (id) => RaceModel.findById(id);
const updateRace = (id, data) => RaceModel.findByIdAndUpdate(id, data, { new: true });
const deleteRace = (id) => RaceModel.findByIdAndDelete(id);

module.exports = {
  getAllRaces,
  createRace,
  getRaceById,
  updateRace,
  deleteRace
};