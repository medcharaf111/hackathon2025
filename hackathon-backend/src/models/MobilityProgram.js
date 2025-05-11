const mongoose = require('mongoose');

const mobilityProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  deadline: { type: String, required: true },
  category: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MobilityProgram', mobilityProgramSchema); 