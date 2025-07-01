const express = require('express');
const router = express.Router();
const { 
  addOrUpdateRating, 
  getUserRating, 
  getRaceRatings, 
  deleteRating 
} = require('../handlers/ratingHandlers');

// Add or update a rating for a race
router.post('/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const { userId, rating } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Invalid rating data. Rating must be between 1 and 5.' 
      });
    }

    const result = await addOrUpdateRating(raceId, userId, rating);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

// Get user's rating for a specific race
router.get('/:raceId/user/:userId', async (req, res) => {
  try {
    const { raceId, userId } = req.params;
    const rating = await getUserRating(raceId, userId);
    res.status(200).json(rating);
  } catch (error) {
    console.error('Error getting user rating:', error);
    res.status(500).json({ error: 'Failed to get user rating' });
  }
});

// Get all ratings for a race
router.get('/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const ratings = await getRaceRatings(raceId);
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error getting race ratings:', error);
    res.status(500).json({ error: 'Failed to get race ratings' });
  }
});

// Delete a user's rating for a race
router.delete('/:raceId/user/:userId', async (req, res) => {
  try {
    const { raceId, userId } = req.params;
    await deleteRating(raceId, userId);
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: 'Failed to delete rating' });
  }
});

module.exports = router; 