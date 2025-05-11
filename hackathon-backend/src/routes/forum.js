const express = require('express');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const router = express.Router();

// Get all forum posts
router.get('/', async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('author', 'nom prenom email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error loading forum posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new forum post
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/forum body:', req.body);
    const { title, content, author, category } = req.body;
    if (!title || !content || !author || !category) {
      console.log('Missing fields:', { title, content, author, category });
      return res.status(400).json({ message: 'All fields required' });
    }
    const user = await User.findById(author);
    if (!user) {
      console.log('User not found for author:', author);
      return res.status(404).json({ message: 'User not found' });
    }
    const post = new ForumPost({ title, content, author, category });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating forum post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a forum post
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const index = post.likes.findIndex(id => id.toString() === userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    const updatedPost = await ForumPost.findById(post._id).populate('author', 'nom prenom email');
    res.json(updatedPost);
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reply to a forum post
router.post('/:id/reply', async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) return res.status(400).json({ message: 'userId and content required' });
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.replies.push({ author: userId, content });
    await post.save();
    const updatedPost = await ForumPost.findById(post._id)
      .populate('author', 'nom prenom email')
      .populate('replies.author', 'nom prenom email');
    res.json(updatedPost);
  } catch (err) {
    console.error('Error replying to post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a reply
router.post('/:postId/reply/:replyId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });
    const index = reply.likes.findIndex(id => id.toString() === userId);
    if (index === -1) {
      reply.likes.push(userId);
    } else {
      reply.likes.splice(index, 1);
    }
    await post.save();
    const updatedPost = await ForumPost.findById(post._id)
      .populate('author', 'nom prenom email')
      .populate('replies.author', 'nom prenom email');
    res.json(updatedPost);
  } catch (err) {
    console.error('Error liking reply:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 