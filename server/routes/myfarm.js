const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not logged in' });
  }
  next();
}

// Get farm details for logged-in user
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const farm = await Farm.findOne({ ownerId: req.user.id });
    if (!farm) {
      return res.status(404).json({ error: 'No farm data found for this user' });
    }
    res.json(farm);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get crop history for logged-in user
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const crops = await Crop.find({ ownerId: req.user.id, status: 'Harvested' });
    if (!crops || crops.length === 0) {
      return res.status(404).json({ error: 'No crop history found for this user' });
    }
    res.json({ crops });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
