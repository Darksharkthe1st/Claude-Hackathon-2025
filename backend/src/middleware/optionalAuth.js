import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalAuthenticate = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // ignore invalid token for optional auth
  }

  return next();
};

