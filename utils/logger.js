const path = require('path');

function makeLog(level) {
  return function (message) {
    console.log(new Date().toISOString() + ' [' + level + '] ' + message);
  };
}

let logger;

if (process.env.VERCEL) {
  logger = {
    info: makeLog('INFO'),
    warn: makeLog('WARN'),
    error: makeLog('ERROR')
  };
} else {
  const winston = require('winston');

  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(function (info) {
        return info.timestamp + ' [' + info.level.toUpperCase() + '] ' + info.message;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(__dirname, '..', 'logs', 'app.log')
      })
    ]
  });
}

module.exports = logger;