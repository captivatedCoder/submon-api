const {
  Subscription,
  validate
} = require('../models/subscription');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res, next) => {

  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let subscription = new Subscription({
    name: req.body.name,
    subType: req.body.subType,
    reminders: req.body.reminders,
    owner: req.body.owner
  });
  try {
    subscription = await subscription.save();

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone');
  }

});

router.put('/:id', async (req, res, next) => {
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

router.delete('/:id', async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndRemove(req.params.id);

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');

    res.send(subscription);
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

module.exports = router;