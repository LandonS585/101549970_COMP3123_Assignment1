const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

async function signup(req, res) {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username || !email || !password) {
      logger.warn('Signup failed: missing fields');
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      logger.warn('Signup failed: user already exists');
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword
    });

    logger.info('Signup successful for user: ' + user.username);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    logger.error('Signup error: ' + error.message);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if ((!username && !email) || !password) {
      logger.warn('Login failed: missing credentials');
      return res.status(400).json({ message: 'Username or email, and password are required' });
    }

    let user;
    if (username) {
      user = await User.findOne({ username: username }).select('+password');
    } else {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    }

    if (!user) {
      logger.warn('Login failed: user not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      logger.warn('Login failed: wrong password for user: ' + user.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info('Login successful for user: ' + user.username);

    return res.status(200).json({
      message: 'Login successful',
      token: token
    });
  } catch (error) {
    logger.error('Login error: ' + error.message);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { signup, login };