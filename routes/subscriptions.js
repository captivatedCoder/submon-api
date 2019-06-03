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

  console.log(req.notes);

  const date = new Date(req.body.expirationDate);

  console.log(date);
  let subscription = new Subscription({
    name: req.body.name,
    subType: req.body.subType,
    owner: req.user,
    expirationDate: date,
    notes: req.body.notes,
    reminders: req.body.reminders
  });
  try {
    subscription = await subscription.save();

    res.send(subscription);
  } catch (ex) {
    res.status(500).send(ex);
  }

});

router.put('/:id', auth, validateObjectId, async (req, res, next) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
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
    const subscriptions = await Subscription.find({
      owner: req.user
    });

    if (!subscriptions) return res.status(404).send(`No subscriptions found`)

    res.send(subscriptions);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (subscription.owner != req.user._id || !subscription)
      return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

module.exports = router;