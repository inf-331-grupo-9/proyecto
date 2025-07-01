const express = require('express');
const router = express.Router();
const { 
  applyToRace, 
  getRaceApplications, 
  getUserApplications, 
  updateApplicationStatus,
  deleteApplication,
  getApplicationCount
} = require('../handlers/applicationHandlers');

// Apply to a race
router.post('/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const { runnerId, runnerName } = req.body;

    if (!runnerId || !runnerName) {
      return res.status(400).json({ 
        error: 'Runner ID and runner name are required.' 
      });
    }

    const result = await applyToRace(raceId, runnerId, runnerName);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error applying to race:', error);
    res.status(500).json({ error: 'Failed to apply to race' });
  }
});

// Get all applications for a race (enterprise view)
router.get('/race/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const applications = await getRaceApplications(raceId);
    const count = await getApplicationCount(raceId);
    res.status(200).json({ applications, count });
  } catch (error) {
    console.error('Error getting race applications:', error);
    res.status(500).json({ error: 'Failed to get race applications' });
  }
});

// Get user's applications (runner view)
router.get('/user/:runnerId', async (req, res) => {
  try {
    const { runnerId } = req.params;
    const applications = await getUserApplications(runnerId);
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error getting user applications:', error);
    res.status(500).json({ error: 'Failed to get user applications' });
  }
});

// Update application status (enterprise action)
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status || !['on-going', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status (on-going, cancelled) is required.' 
      });
    }

    const result = await updateApplicationStatus(applicationId, status);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Delete application (runner can withdraw)
router.delete('/:raceId/:runnerId', async (req, res) => {
  try {
    const { raceId, runnerId } = req.params;
    await deleteApplication(raceId, runnerId);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router; 