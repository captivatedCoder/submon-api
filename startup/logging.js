const winston = require('winston');
require('express-async-errors');
// require('winston-mongodb')


module.exports = function () {

  winston.handleExceptions(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true
    }),
    new winston.transports.File({
      filename: 'unhandledException.json',
      level: 'error'
    }));

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, {
    filename: 'logfile.json',
    level: 'debug'
  });

  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/subtest',
  //   level: 'error'
  // });
}