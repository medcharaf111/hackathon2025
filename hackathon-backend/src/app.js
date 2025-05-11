const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoUri, port } = require('./config');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const forumRoutes = require('./routes/forum');
const chatbotRoutes = require('./routes/chatbot');
const coursesRoutes = require('./routes/courses');
const mobilityRoutes = require('./routes/mobility');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/mobility', mobilityRoutes);
app.use('/uploads', express.static(require('path').join(__dirname, '../public/uploads')));

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('MongoDB connection error:', err)); 