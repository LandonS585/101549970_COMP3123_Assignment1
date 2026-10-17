const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { signupRules, loginRules } = require('../validators/userValidator');

const router = express.Router();

router.post('/signup', authLimiter, signupRules, validate, userController.signup);
router.post('/login', authLimiter, loginRules, validate, userController.login);

module.exports = router;