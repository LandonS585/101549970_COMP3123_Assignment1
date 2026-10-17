const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    logger.warn('Rate limit exceeded on ' + req.method + ' ' + req.originalUrl);
    return res.status(429).json({
      message: 'Too many requests. Please try again in a minute'
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    logger.warn('Rate limit exceeded on ' + req.method + ' ' + req.originalUrl);
    return res.status(429).json({
      message: 'Too many requests. Please try again later'
    });
  }
});

module.exports = { authLimiter, apiLimiter };