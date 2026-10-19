const nodeCrypto = require('crypto');
if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto.webcrypto;
}

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

if (process.env.VERCEL) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(express.json());
app.use(requestLogger);

let dbPromise = null;

async function ensureDB(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    if (!dbPromise) {
      dbPromise = mongoose.connect(process.env.MONGODB_URI);
    }
    await dbPromise;
    next();
  } catch (error) {
    dbPromise = null;
    logger.error('MongoDB connection failed: ' + error.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }
}

if (process.env.VERCEL) {
  app.use(ensureDB);
}

app.use('/api', apiLimiter);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/health', function (req, res) {
  let dbStatus = 'disconnected';
  if (mongoose.connection.readyState === 1) {
    dbStatus = 'connected';
  }

  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  connectDB().then(function () {
    app.listen(PORT, function () {
      logger.info('Server started on port ' + PORT);
    });
  });
}

module.exports = app;