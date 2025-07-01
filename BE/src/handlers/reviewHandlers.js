const { ReviewModel } = require('../model/review');

const addOrUpdateReview = async (raceId, userId, userName, comment) => {
  try {
    const review = await ReviewModel.findOneAndUpdate(
      { raceId, userId },
      { comment, userName },
      { upsert: true, new: true }
    );
    return review;
  } catch (error) {
    throw error;
  }
};

const getUserReview = (raceId, userId) => {
  return ReviewModel.findOne({ raceId, userId });
};

const getRaceReviews = (raceId) => {
  return ReviewModel.find({ raceId }).sort({ createdAt: -1 });
};

const deleteReview = async (raceId, userId) => {
  try {
    const result = await ReviewModel.findOneAndDelete({ raceId, userId });
    return result;
  } catch (error) {
    throw error;
  }
};

const getReviewCount = (raceId) => {
  return ReviewModel.countDocuments({ raceId });
};

module.exports = {
  addOrUpdateReview,
  getUserReview,
  getRaceReviews,
  deleteReview,
  getReviewCount
}; 