const express = require('express');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Search engineers
router.get('/', optionalAuth, (req, res) => {
  try {
    const filters = {
      skills: req.query.skills,
      location: req.query.location
    };

    const engineers = User.findEngineers(filters);

    // Remove sensitive data
    const sanitizedEngineers = engineers.map(engineer => ({
      id: engineer.id,
      name: engineer.name,
      location: engineer.location,
      bio: engineer.bio,
      skills: engineer.skills,
      createdAt: engineer.created_at
    }));

    res.json({ engineers: sanitizedEngineers });
  } catch (error) {
    console.error('Search engineers error:', error);
    res.status(500).json({ error: 'Failed to search engineers' });
  }
});

// Get engineer profile
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const engineer = User.findById(req.params.id);

    if (!engineer || engineer.user_type !== 'engineer') {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    const stats = User.getStats(engineer.id);

    res.json({
      id: engineer.id,
      name: engineer.name,
      location: engineer.location,
      bio: engineer.bio,
      skills: engineer.skills,
      createdAt: engineer.created_at,
      stats
    });
  } catch (error) {
    console.error('Get engineer profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve engineer profile' });
  }
});

module.exports = router;
