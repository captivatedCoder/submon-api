const _ = require('lodash');
const {
  User,
  validate
} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');

    res.send(user);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = User.findOne({
    email: req.body.email
  });

  try {
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();


    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  } catch (ex) {
    if (ex.code === 11000 && ex.name === "MongoError") {
      res.status(500).send('User already exists');
    }
    res.status(500).send(ex);
  }

});

module.exports = router;