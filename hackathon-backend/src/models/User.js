const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  niveauEducation: { type: String, required: true },
  profession: { type: String, enum: ['student', 'professor'], required: true },
  lieu: { type: String },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now },
  quizScores: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      score: Number
    }
  ]
});

module.exports = mongoose.model('User', userSchema); 