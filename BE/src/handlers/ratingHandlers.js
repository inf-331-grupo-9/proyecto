const { RatingModel } = require('../model/rating');
const { RaceModel } = require('../model/race');

const addOrUpdateRating = async (raceId, userId, rating) => {
  try {
    // Add or update the rating
    const ratingDoc = await RatingModel.findOneAndUpdate(
      { raceId, userId },
      { rating },
      { upsert: true, new: true }
    );

    // Calculate new average rating for the race
    const ratings = await RatingModel.find({ raceId });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    // Update the race with new average rating
    await RaceModel.findByIdAndUpdate(raceId, {
      rating: {
        average: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        count: ratings.length
      }
    });

    return ratingDoc;
  } catch (error) {
    throw error;
  }
};

const getUserRating = (raceId, userId) => {
  return RatingModel.findOne({ raceId, userId });
};

const getRaceRatings = (raceId) => {
  return RatingModel.find({ raceId }).sort({ createdAt: -1 });
};

const deleteRating = async (raceId, userId) => {
  try {
    await RatingModel.findOneAndDelete({ raceId, userId });

    // Recalculate average rating
    const ratings = await RatingModel.find({ raceId });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    // Update the race with new average rating
    await RaceModel.findByIdAndUpdate(raceId, {
      rating: {
        average: Math.round(averageRating * 10) / 10,
        count: ratings.length
      }
    });

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addOrUpdateRating,
  getUserRating,
  getRaceRatings,
  deleteRating
}; 