const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number // index of correct option
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema],
  type: { type: String, enum: ['standard', 'custom'], default: 'standard' },
  level: { type: String, enum: ['all', 'primaire', 'secondaire', 'universitaire'], default: 'all' },
});

quizSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Quiz', quizSchema); 