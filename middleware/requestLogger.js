const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  res.on('finish', function () {
    logger.info(req.method + ' ' + req.originalUrl + ' ' + res.statusCode);
  });
  next();
}

module.exports = requestLogger;