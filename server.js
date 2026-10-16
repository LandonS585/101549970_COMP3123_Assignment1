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

const app = express();

app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use('/api/v1/user', userRoutes);

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

const PORT = process.env.PORT || 3000;

connectDB().then(function () {
  app.listen(PORT, function () {
    logger.info('Server started on port ' + PORT);
  });
});