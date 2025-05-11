const express = require('express');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

// Get quiz by id
router.get('/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(quiz);
});

// Save user's quiz score
router.post('/:id/score', async (req, res) => {
  const { userId, score } = req.body;
  if (!userId || typeof score !== 'number') return res.status(400).json({ message: 'userId and score required' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Update or add score for this quiz
  const existing = user.quizScores.find(q => q.quizId.toString() === req.params.id);
  if (existing) {
    existing.score = score;
  } else {
    user.quizScores.push({ quizId: req.params.id, score });
  }
  await user.save();
  res.json({ message: 'Score saved' });
});

// Get user's score for a quiz
router.get('/:id/score', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    // Validate userId and quizId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid userId or quizId format' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const scoreObj = user.quizScores.find(q => q.quizId.toString() === req.params.id);
    res.json({ score: scoreObj ? scoreObj.score : null });
  } catch (err) {
    console.error('Error in GET /:id/score:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a custom quiz (professor only)
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, questions, level } = req.body;
    if (!userId || !title || !description || !questions || !level) {
      return res.status(400).json({ message: 'userId, title, description, questions, and level are required' });
    }
    const user = await User.findById(userId);
    if (!user || user.profession !== 'professor') {
      return res.status(403).json({ message: 'Only professors can create quizzes' });
    }
    const quiz = await Quiz.create({
      title,
      description,
      questions,
      level,
      type: 'custom',
    });
    res.status(201).json(quiz);
  } catch (err) {
    console.error('Error in POST /quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a quiz (professor only)
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const user = await User.findById(userId);
    if (!user || user.profession !== 'professor') {
      return res.status(403).json({ message: 'Only professors can delete quizzes' });
    }
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    console.error('Error in DELETE /quiz/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 