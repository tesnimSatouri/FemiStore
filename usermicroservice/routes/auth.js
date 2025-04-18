const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Inscription
router.post('/register', async (req, res) => {
  const { name, email, password, role, adresse, telephone } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email et password requis' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }
    user = new User({ name, email, password, role, adresse, telephone });
    await user.save();
    const payload = { id: user._id, role: user.role || 'Client' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erreur dans /register:', error); // Ajoute ce log
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et password sont requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const payload = { id: user._id, role: user.role || 'Client' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;