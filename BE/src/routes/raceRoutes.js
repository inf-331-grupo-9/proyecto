const express = require('express');
const router = express.Router();
const raceData = require('../handlers/raceHandlers');

// Get all races (filtered by query parameters)
router.get('/data', async (req, res) => {
  try {
    const { name, location, dateFrom, dateTo, enterpriseId } = req.query;
    const query = {};
    
    if (name) query.name = new RegExp(name, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }
    if (enterpriseId) query.createdBy = enterpriseId;

    const races = await raceData.getAllRaces(query);
    res.json(races);
  } catch (error) {
    console.error('Error getting races:', error);
    res.status(500).json({ error: 'Failed to get races' });
  }
});

// Get race by ID
router.get('/data/:id', async (req, res) => {
  try {
    const race = await raceData.getRaceById(req.params.id);
    race ? res.json(race) : res.status(404).send('Not found');
  } catch (error) {
    console.error('Error getting race:', error);
    res.status(500).json({ error: 'Failed to get race' });
  }
});

// Create new race (enterprise only)
router.post('/data', async (req, res) => {
  try {
    const race = await raceData.createRace(req.body);
    res.status(201).json(race);
  } catch (error) {
    console.error('Error creating race:', error);
    res.status(500).json({ error: 'Failed to create race' });
  }
});

// Update race (enterprise only)
router.put('/data/:id', async (req, res) => {
  try {
    const updated = await raceData.updateRace(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).send('Not found');
  } catch (error) {
    console.error('Error updating race:', error);
    res.status(500).json({ error: 'Failed to update race' });
  }
});

// Delete race (enterprise only)
router.delete('/data/:id', async (req, res) => {
  try {
    const deleted = await raceData.deleteRace(req.params.id);

    deleted ? res.sendStatus(204) : res.status(404).send('Not found');
  } catch (error) {
    console.error('Error deleting race:', error);
    res.status(500).json({ error: 'Failed to delete race' });
  }
});

// Get races by enterprise
router.get('/enterprise/:enterpriseId', async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    const races = await raceData.getRacesByEnterprise(enterpriseId);
    res.json(races);
  } catch (error) {
    console.error('Error getting enterprise races:', error);
    res.status(500).json({ error: 'Failed to get enterprise races' });
  }
});

module.exports = router;