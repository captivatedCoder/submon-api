const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const subscriptions = require('../routes/subscriptions');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/subscriptions', subscriptions);
  app.use(error);
}