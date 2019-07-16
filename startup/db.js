const mongoose = require('mongoose');
const config = require('config');
const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};

module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db, dbOptions)
  .then(() => console.log(`Connected to ${db}...`))
}