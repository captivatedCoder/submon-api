const _ = require('lodash');
const {
  User,
  validate
} = require('../models/user');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/**
 * @api {get} /users/me Get current user
 * @apiName GetUser
 * @apiGroup Users
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {String} Body User information
   {
     "_id": "{ObjectId}",
     "name": "testules",
     "email": "dostestes@email.com",
     "__v": 0
   }
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.send(user);
  } catch (ex) {
    res.status(500).send('Something is borked.');
  }
});

/**
 * @api {post} /users Login user
 * @apiName LoginUser
 * @apiGroup Users
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {String} Body User information
   {
     "_id": "{ObjectId}",
     "name": "testules",
     "email": "dostestes@email.com",
     "__v": 0
   }
 * @apiError 400 Error validating the body, message attached
 * @apiError 409 User already exists.  Email addresses must be unique
 */
router.post('/', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = User.findOne({
    email: req.body.email
  });
  if (!user) return res.status(409).send('User already exists.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;