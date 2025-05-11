const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const MobilityApplication = require('../models/MobilityApplication');
const User = require('../models/User');
const MobilityProgram = require('../models/MobilityProgram');

// Set up multer for CV and passport uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/mobility'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to check if user is student
async function requireStudent(req, res, next) {
  const userId = req.body.userId;
  if (!userId) return res.status(401).json({ message: 'userId required' });
  const user = await User.findById(userId);
  if (!user || user.profession !== 'student') {
    return res.status(403).json({ message: 'Only students can apply.' });
  }
  req.user = user;
  next();
}
// Middleware to check if user is professor
async function requireProfessor(req, res, next) {
  const userId = req.query.userId;
  if (!userId) return res.status(401).json({ message: 'userId required' });
  const user = await User.findById(userId);
  if (!user || user.profession !== 'professor') {
    return res.status(403).json({ message: 'Only professors can view applications.' });
  }
  req.user = user;
  next();
}
// Middleware to check if user is professor (for POST /programs)
async function requireProfessorBody(req, res, next) {
  const userId = req.body.userId;
  if (!userId) return res.status(401).json({ message: 'userId required' });
  const user = await User.findById(userId);
  if (!user || user.profession !== 'professor') {
    return res.status(403).json({ message: 'Only professors can add programs.' });
  }
  req.user = user;
  next();
}

// POST /api/mobility/apply - Student applies to a program
router.post('/apply', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'passport', maxCount: 1 }]), requireStudent, async (req, res) => {
  try {
    const { programId, otherDetails } = req.body;
    if (!programId || !req.files['cv'] || !req.files['passport']) {
      return res.status(400).json({ message: 'programId, cv, and passport are required' });
    }
    const cvUrl = `/uploads/mobility/${req.files['cv'][0].filename}`;
    const passportUrl = `/uploads/mobility/${req.files['passport'][0].filename}`;
    const app = new MobilityApplication({
      programId,
      student: req.user._id,
      cvUrl,
      passportUrl,
      otherDetails: otherDetails || ""
    });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error applying', error: err.message });
  }
});

// GET /api/mobility/applications?programId=...&userId=... - Professor views all applications for a program
router.get('/applications', requireProfessor, async (req, res) => {
  try {
    const { programId } = req.query;
    if (!programId) return res.status(400).json({ message: 'programId required' });
    const apps = await MobilityApplication.find({ programId }).populate('student', 'nom prenom email niveauEducation');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
});

// POST /api/mobility/programs - Add a mobility program (professor only)
router.post('/programs', upload.single('image'), requireProfessorBody, async (req, res) => {
  try {
    const { title, description, location, duration, deadline, category } = req.body;
    if (!title || !description || !location || !duration || !deadline || !category) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const image = req.file ? `/uploads/mobility/${req.file.filename}` : '';
    const program = new MobilityProgram({
      title,
      description,
      image,
      location,
      duration,
      deadline,
      category,
      createdBy: req.user._id
    });
    await program.save();
    res.status(201).json(program);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding program', error: err.message });
  }
});

// GET /api/mobility/programs - List all mobility programs
router.get('/programs', async (req, res) => {
  try {
    const programs = await MobilityProgram.find().populate('createdBy', 'nom prenom email');
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching programs', error: err.message });
  }
});

// DELETE /api/mobility/programs/:id - Delete a mobility program (professor only, must be creator)
router.delete('/programs/:id', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(401).json({ message: 'userId required' });
    const user = await User.findById(userId);
    if (!user || user.profession !== 'professor') {
      return res.status(403).json({ message: 'Only professors can delete programs.' });
    }
    const program = await MobilityProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    if (String(program.createdBy) !== String(user._id)) {
      return res.status(403).json({ message: 'You can only delete programs you created.' });
    }
    await program.deleteOne();
    res.json({ message: 'Program deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting program', error: err.message });
  }
});

module.exports = router; 