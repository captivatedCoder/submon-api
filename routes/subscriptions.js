const {
  Subscription,
  validate
} = require('../models/subscription');
const {SubType} = require('../models/subType');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', auth, async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      owner: req.user
    });

    if (!subscriptions) return res.status(404).send(`No subscriptions found`)

    res.send(subscriptions);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (subscription.owner != req.user._id || !subscription)
      return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.post('/', auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const subType = await SubType.findById(req.body.subId);
  if (!subType) return res.status(400).send("Invalid Subscription Type");

  let subscription = new Subscription({
    name: req.body.name,
    subType:{
      _id: subType._id,
      name: subType.name
    },
    owner: req.user,
    expirationDate: req.body.expirationDate,
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
    res.status(500).send(ex);
  }

});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndRemove(req.params.id);

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');
    res.status(200).send('Subscription deleted');
  } catch (ex) {
    res.status(500).send(ex);
  }
});

module.exports = router;