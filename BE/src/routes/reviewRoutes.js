const express = require('express');
const router = express.Router();
const { 
  addOrUpdateReview, 
  getUserReview, 
  getRaceReviews, 
  deleteReview,
  getReviewCount
} = require('../handlers/reviewHandlers');

// Add or update a review for a race
router.post('/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const { userId, userName, comment } = req.body;

    if (!userId || !userName || !comment) {
      return res.status(400).json({ 
        error: 'User ID, user name, and comment are required.' 
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({ 
        error: 'Comment must be 500 characters or less.' 
      });
    }

    const result = await addOrUpdateReview(raceId, userId, userName, comment);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Get user's review for a specific race
router.get('/:raceId/user/:userId', async (req, res) => {
  try {
    const { raceId, userId } = req.params;
    const review = await getUserReview(raceId, userId);
    res.status(200).json(review);
  } catch (error) {
    console.error('Error getting user review:', error);
    res.status(500).json({ error: 'Failed to get user review' });
  }
});

// Get all reviews for a race
router.get('/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const reviews = await getRaceReviews(raceId);
    const count = await getReviewCount(raceId);
    res.status(200).json({ reviews, count });
  } catch (error) {
    console.error('Error getting race reviews:', error);
    res.status(500).json({ error: 'Failed to get race reviews' });
  }
});

// Delete a user's review for a race
router.delete('/:raceId/user/:userId', async (req, res) => {
  try {
    const { raceId, userId } = req.params;
    await deleteReview(raceId, userId);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router; 