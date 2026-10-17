const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('Validation failed on ' + req.method + ' ' + req.originalUrl);

    const errorList = errors.array().map(function (e) {
      return { field: e.path, message: e.msg };
    });

    return res.status(400).json({
      message: 'Validation failed',
      errors: errorList
    });
  }

  next();
}

module.exports = validate;