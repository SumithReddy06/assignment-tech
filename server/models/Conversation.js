const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Analysis'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userRole: {
    type: String,
    default: 'Analyst'
  },
  userId: {
    type: String,
    default: null
  },
  // New fields for storing full chat history
  messages: [{
    id: Number,
    role: String,
    content: String,
    timestamp: Date,
    traceId: String,
    visualizations: [{
      type: String
    }]
  }],
  visualizations: [{
    type: String,
    data: mongoose.Schema.Types.Mixed
  }],
  sessionId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
