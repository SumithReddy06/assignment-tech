const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent activities
router.get('/recent/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 50;
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new activity
router.post('/', async (req, res) => {
  try {
    const { type, description, metadata, userRole } = req.body;
    
    const activity = new Activity({
      id: Date.now(),
      type,
      description,
      userRole: userRole || 'Analyst',
      metadata: metadata || {},
      timestamp: new Date()
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an activity
router.delete('/:id', async (req, res) => {
  try {
    const result = await Activity.deleteOne({ id: parseInt(req.params.id) });
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all activities
router.delete('/', async (req, res) => {
  try {
    await Activity.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
