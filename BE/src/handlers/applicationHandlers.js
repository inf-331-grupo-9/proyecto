const { ApplicationModel } = require('../model/application');
const { RaceModel } = require('../model/race');

const applyToRace = async (raceId, runnerId, runnerName) => {
  try {
    const application = await ApplicationModel.findOneAndUpdate(
      { raceId, runnerId },
      { runnerName, status: 'on-going' },
      { upsert: true, new: true }
    );
    return application;
  } catch (error) {
    throw error;
  }
};

const getRaceApplications = (raceId) => {
  return ApplicationModel.find({ raceId }).sort({ appliedAt: -1 });
};

const getUserApplications = (runnerId) => {
  return ApplicationModel.find({ runnerId }).sort({ appliedAt: -1 });
};

const updateApplicationStatus = async (applicationId, status) => {
  try {
    const application = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    return application;
  } catch (error) {
    throw error;
  }
};

const deleteApplication = async (raceId, runnerId) => {
  try {
    const result = await ApplicationModel.findOneAndDelete({ raceId, runnerId });
    return result;
  } catch (error) {
    throw error;
  }
};

const getApplicationCount = (raceId) => {
  return ApplicationModel.countDocuments({ raceId });
};

module.exports = {
  applyToRace,
  getRaceApplications,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationCount
}; 