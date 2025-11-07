const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('userType').isIn(['engineer', 'community']),
    body('location').trim().notEmpty()
  ],
  validateRequest,
  (req, res) => {
    try {
      const { email, password, name, userType, phone, location, bio, skills } = req.body;

      // Check if user exists
      const existingUser = User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create user
      const user = User.create({
        email,
        password,
        name,
        userType,
        phone,
        location,
        bio,
        skills
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.user_type,
          location: user.location
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validateRequest,
  (req, res) => {
    try {
      const { email, password } = req.body;

      const user = User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = User.verifyPassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.user_type,
          location: user.location,
          bio: user.bio,
          skills: user.skills
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = User.getStats(user.id);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.user_type,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      createdAt: user.created_at,
      stats
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Update profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, location, bio, skills } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (location) updates.location = location;
    if (bio) updates.bio = bio;
    if (skills) updates.skills = skills;

    const user = User.update(req.user.userId, updates);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
