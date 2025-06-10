const express = require('express');
const router = express.Router();
const raceData = require('../handlers/raceHandlers');

router.get('/data', async (req, res) => {
  const races = await raceData.getAllRaces();
  res.json(races);
});

router.get('/data/:id', async (req, res) => {
  const race = await raceData.getRaceById(req.params.id);
  race ? res.json(race) : res.status(404).send('Not found');
});

router.post('/data', async (req, res) => {
  const race = await raceData.createRace(req.body);
  res.status(201).json(race);
});

router.put('/data/:id', async (req, res) => {
  const updated = await raceData.updateRace(req.params.id, req.body);
  updated ? res.json(updated) : res.status(404).send('Not found');
});

router.delete('/data/:id', async (req, res) => {
  const deleted = await raceData.deleteRace(req.params.id);
  deleted ? res.sendStatus(204) : res.status(404).send('Not found');
});

module.exports = router;
