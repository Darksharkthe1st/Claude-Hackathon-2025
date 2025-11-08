const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function requireUserType(...types) {
  return (req, res, next) => {
    if (!req.user || !types.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      // Token invalid but continue anyway
    }
  }
  next();
}

module.exports = { authenticateToken, requireUserType, optionalAuth };
