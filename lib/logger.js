var config = require('config');
var winston = require('winston');
winston.emitErrs = true;

module.exports = new winston.Logger({
  transports: [
  new winston.transports.File({
    level: config.logging.file.level,
    filename: config.logging.file.name,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 1,
    colorize: false,
    timestamp : true
  }),
  new winston.transports.Console({
    level: config.logging.console.level,
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: false
  })
  ],
  exitOnError: false
});
