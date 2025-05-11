const mongoose = require('mongoose');

const mobilityApplicationSchema = new mongoose.Schema({
  programId: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cvUrl: { type: String, required: true },
  passportUrl: { type: String, required: true },
  otherDetails: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MobilityApplication', mobilityApplicationSchema); 