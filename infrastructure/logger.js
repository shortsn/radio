var winston = require('winston');
winston.emitErrs = true;

module.exports = function(logfile){
  var logger = new winston.Logger({
      transports: [
          new winston.transports.File({
              level: 'info',
              filename: './'+logfile,
              handleExceptions: true,
              json: false,
              maxsize: 5242880, //5MB
              maxFiles: 5,
              colorize: false
          }),
          new winston.transports.Console({
              level: 'debug',
              handleExceptions: true,
              json: false,
              colorize: true,
              timestamp: false
          })
      ],
      exitOnError: false
  });

  logger.debug('logfile -> '+logfile);
  return logger;
};
