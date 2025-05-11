const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, niveauEducation, lieu, age, profession } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const hashed = await bcrypt.hash(motDePasse, 10);
    const user = new User({ nom, prenom, email, motDePasse: hashed, niveauEducation, lieu, age, profession });
    await user.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        niveauEducation: user.niveauEducation,
        lieu: user.lieu,
        age: user.age,
        profession: user.profession
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        niveauEducation: user.niveauEducation,
        lieu: user.lieu,
        age: user.age,
        profession: user.profession
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router; 