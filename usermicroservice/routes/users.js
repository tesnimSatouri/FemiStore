const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../Middleware/auth');

// Lister tous les utilisateurs (Admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir son profil
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const { role, name } = req.query; // Filtres via query params
    let query = {};
    if (role) query.role = role;
    if (name) query.name = { $regex: name, $options: 'i' }; // Recherche insensible à la casse
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erreur dans GET /users/all:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;