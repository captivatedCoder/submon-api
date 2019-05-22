const winston = require('winston');
const mongoose = require('mongoose');
const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};

module.exports = function() {
  mongoose.connect('mongodb://localhost/subtest', dbOptions)
  .then(() => winston.info('Connected to MongoDB...'))
}