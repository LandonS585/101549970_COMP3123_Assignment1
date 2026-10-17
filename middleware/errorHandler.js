const logger = require('../utils/logger');

function notFound(req, res, next) {
  logger.warn('Route not found: ' + req.method + ' ' + req.originalUrl);
  return res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    logger.warn('Malformed JSON on ' + req.method + ' ' + req.originalUrl);
    return res.status(400).json({ message: 'Malformed JSON in request body' });
  }

  logger.error('Unexpected error on ' + req.method + ' ' + req.originalUrl + ': ' + err.message);
  return res.status(500).json({ message: 'Internal server error' });
}

module.exports = { notFound, errorHandler };