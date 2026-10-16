const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Auth failed: missing or badly formatted token on ' + req.method + ' ' + req.originalUrl);
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('Auth failed: expired token');
        return res.status(401).json({ message: 'Token has expired' });
      }
      logger.warn('Auth failed: invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      logger.warn('Auth failed: token belongs to a user that does not exist');
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error: ' + error.message);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = authMiddleware;