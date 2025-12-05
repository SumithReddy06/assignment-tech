const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Get all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ timestamp: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent conversations
router.get('/recent/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 50;
    const conversations = await Conversation.find()
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search conversations
router.get('/search/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const conversations = await Conversation.find({
      $or: [
        { query: { $regex: searchTerm, $options: 'i' } },
        { response: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ timestamp: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new conversation
router.post('/', async (req, res) => {
  try {
    const { query, response, category, userRole, messages, visualizations, sessionId } = req.body;
    
    const conversation = new Conversation({
      id: Date.now(),
      query,
      response,
      category: category || 'Analysis',
      userRole: userRole || 'Analyst',
      messages: messages || [],
      visualizations: visualizations || [],
      sessionId: sessionId,
      timestamp: new Date()
    });

    await conversation.save();
    console.log('✅ Conversation saved to MongoDB:', conversation.id);
    res.status(201).json(conversation);
  } catch (error) {
    console.error('❌ Error saving conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a conversation
router.delete('/:id', async (req, res) => {
  try {
    const result = await Conversation.deleteOne({ id: parseInt(req.params.id) });
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all conversations
router.delete('/', async (req, res) => {
  try {
    await Conversation.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
