const { body, param, query } = require('express-validator');

const employeeRules = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must be 50 characters or less'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must be 50 characters or less'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email format is not valid')
    .isLength({ max: 100 }).withMessage('Email is too long'),

  body('position')
    .trim()
    .notEmpty().withMessage('Position is required')
    .isLength({ max: 50 }).withMessage('Position must be 50 characters or less'),

  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isFloat({ gt: 0 }).withMessage('Salary must be a number greater than 0'),

  body('date_of_joining')
    .notEmpty().withMessage('Date of joining is required')
    .isISO8601().withMessage('Date of joining must be a valid date like 2026-01-15'),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isLength({ max: 50 }).withMessage('Department must be 50 characters or less')
];

const idParamRules = [
  param('eid').isMongoId().withMessage('Employee id is not a valid id')
];

const idQueryRules = [
  query('eid')
    .notEmpty().withMessage('Employee id (eid) is required')
    .isMongoId().withMessage('Employee id is not a valid id')
];

module.exports = { employeeRules, idParamRules, idQueryRules };