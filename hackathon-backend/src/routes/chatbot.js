const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // If not installed: npm install node-fetch

router.post('/', async (req, res) => {
  const { message } = req.body;
  // List of sustainable development keywords (expand as needed)
  const sdgKeywords = [
    'développement durable', 'sustainable development', 'écologie', 'environnement', 'climat', 'biodiversité',
    'énergie renouvelable', 'pollution', 'recyclage', 'changement climatique', 'énergies vertes',
    'ODD', 'objectifs de développement durable', 'green energy', 'climate change', 'biodiversity',
    'renewable energy', 'waste', 'carbon', 'empreinte carbone', 'carbon footprint',
    'recycling', 'sustainability', 'écosystème', 'ecosystem', 'eau', 'water', 'air', 'air quality',
    'qualité de l\'air', 'économie circulaire', 'circular economy', 'transition énergétique', 'energy transition',
    'déchets', 'waste management', 'gestion des déchets', 'responsabilité sociale', 'social responsibility',
    'responsabilité environnementale', 'environmental responsibility', 'agriculture durable', 'sustainable agriculture',
    'urbanisme durable', 'sustainable urbanism', 'transport vert', 'green transport', 'mobilité durable', 'sustainable mobility'
  ];
  // List of website usage/help keywords
  const helpKeywords = [
    'inscription', 's\'inscrire', 'sign up', 'register', 'connexion', 'login', 'se connecter', 'mot de passe', 'password',
    'compte', 'account', 'profil', 'profile', 'utiliser', 'use', 'naviguer', 'navigate', 'forum', 'quizz', 'quiz', 'actualités', 'news',
    'changer la langue', 'change language', 'langue', 'language', 'comment', 'how to', 'où', 'where', 'trouver', 'find', 'aide', 'help',
    'déconnexion', 'logout', 'se déconnecter', 'problème', 'problem', 'erreur', 'error', 'contact', 'support', 'faq', 'utilisation', 'usage',
    'certification', 'certificat', 'certification', 'programme', 'program', 'cours', 'course', 'mobilité', 'mobility', 'à propos', 'about'
  ];
  // Check if the message is about sustainable development or website usage/help
  const lowerMsg = message.toLowerCase();
  // Whole word match function
  function matchesWholeWord(keywords) {
    return keywords.some(kw => new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerMsg));
  }
  const isSustainable = matchesWholeWord(sdgKeywords);
  const isHelp = matchesWholeWord(helpKeywords);
  // Log incoming message and filter result
  console.log(`[Chatbot] Message: '${message}' | isSustainable: ${isSustainable} | isHelp: ${isHelp}`);
  if (!isSustainable && !isHelp) {
    return res.json({
      reply: "Je suis un assistant spécialisé dans le développement durable et l'utilisation de ce site. Veuillez poser une question liée à l'écologie, l'environnement, le développement durable, ou sur l'utilisation de la plateforme.\n\nI am a chatbot specialized in sustainable development and website usage. Please ask a question related to ecology, environment, sustainability, or how to use the platform."
    });
  }
  try {
    // Structure the prompt to instruct the LLM to answer in a structured way
    const prompt = `Réponds à la question suivante uniquement si elle concerne le développement durable ou l'utilisation de ce site web. Structure ta réponse en trois parties claires :\n\nRésumé :\nUn résumé bref et clair.\n\nDétails :\nDes explications détaillées, exemples ou conseils.\n\nSources/Références :\nListe des sources fiables ou liens utiles si possible.\n\nQuestion : ${message}`;
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        prompt: prompt,
        stream: false
      })
    });
    const data = await ollamaRes.json();
    // Remove all <think>...</think> blocks and any standalone <think> or </think> tags (even on their own lines)
    let cleaned = data.response.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleaned = cleaned.replace(/^<think>\s*$/gim, '');
    cleaned = cleaned.replace(/^<\/think>\s*$/gim, '');
    cleaned = cleaned.replace(/<think>|<\/think>/gi, '');
    cleaned = cleaned.replace(/\n{2,}/g, '\n').trim();
    res.json({ reply: cleaned });
  } catch (err) {
    res.json({ reply: "Erreur lors de la communication avec DeepSeek." });
  }
});

module.exports = router; 