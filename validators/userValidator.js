const { body } = require('express-validator');

const signupRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email format is not valid')
    .isLength({ max: 100 }).withMessage('Email is too long')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 64 }).withMessage('Password must be 8 to 64 characters')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
];

const loginRules = [
  body('username')
    .optional()
    .trim()
    .isString().withMessage('Username must be text')
    .isLength({ max: 30 }).withMessage('Username is too long'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email format is not valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be text')
    .isLength({ max: 64 }).withMessage('Password is too long')
];

module.exports = { signupRules, loginRules };