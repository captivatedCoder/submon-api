const {
  Subscription,
  validate
} = require('../models/subscription');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', auth, async (req, res, next) => {

  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let subscription = new Subscription({
    name: req.body.name,
    subType: req.body.subType,
    owner: req.body.owner,
    reminders: req.body.reminders
  });
  try {
    subscription = await subscription.save();

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone');
  }

});

router.put('/:id', auth, validateObjectId, async (req, res, next) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {


    const subscription = await Subscription.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    }, {
      new: true
    });

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }

});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndRemove(req.params.id);

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

router.get('/', auth, async (req, res, next) => {
  try {
    const user = req.body._id;

    const subscriptions = await Subscription.find({
      owner: user
    });

    if (!subscriptions) return res.status(404).send(`No subscriptions found for user ${user}`)

    res.send(subscriptions);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

module.exports = router;