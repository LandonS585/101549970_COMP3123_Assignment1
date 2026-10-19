const winston = require('winston');
const path = require('path');

const transports = [new winston.transports.Console()];

if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'logs', 'app.log')
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(function (info) {
      return info.timestamp + ' [' + info.level.toUpperCase() + '] ' + info.message;
    })
  ),
  transports: transports
});

module.exports = logger;s