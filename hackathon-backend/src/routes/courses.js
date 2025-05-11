const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const User = require('../models/User');

// Set up multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/courses'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed!'));
  }
});

// Middleware to check if user is professor
async function requireProfessor(req, res, next) {
  const userId = req.body.userId;
  if (!userId) return res.status(401).json({ message: 'userId required' });
  const user = await User.findById(userId);
  if (!user || user.profession !== 'professor') {
    return res.status(403).json({ message: 'Only professors can add courses.' });
  }
  req.user = user;
  next();
}

// POST /api/courses - Add a course (professor only)
router.post('/', upload.single('file'), requireProfessor, async (req, res) => {
  console.log('POST /api/courses req.body:', req.body);
  try {
    const { title, level } = req.body;
    if (!title || !level || !req.file) {
      return res.status(400).json({ message: 'title, level, and file are required' });
    }
    const fileUrl = `/uploads/courses/${req.file.filename}`;
    const course = new Course({
      title,
      level,
      fileUrl,
      createdBy: req.user._id
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error adding course', error: err.message });
  }
});

// GET /api/courses?level=primaire|secondaire|universitaire - List courses (optionally filtered by level)
router.get('/', async (req, res) => {
  try {
    const { level } = req.query;
    const filter = level ? { level } : {};
    const courses = await Course.find(filter).populate('createdBy', 'nom prenom email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

module.exports = router; 