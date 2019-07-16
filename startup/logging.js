const {createLogger, transports} = require('winston');
require('express-async-errors');


module.exports = function () {

  const logger = createLogger({
    transports: [
      new transports.File({filename: 'log.json'})
    ],
    exceptionHandlers: [
      new transports.File({filename: 'exceptions.json'})
    ]
  });
}