const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
