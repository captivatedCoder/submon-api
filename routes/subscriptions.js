const {
  Subscription,
  validate
} = require('../models/subscription');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

/**
 * @api {get} /subscriptions/ Get all subscriptions for current user
 * @apiName GetAllSub
 * @apiGroup Subscriptions
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {Subscription} Body Array of Subscriptions
 * @apiSuccessExample Example data on success:
 * {
    {subscription1},
    {subscription2}
 * }

 * @apiError 404 No subscriptions found
 */
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

/**
 * @api {get} /subscriptions/:id Get a specific subscription for the current user
 * @apiName GetOneSub
 * @apiGroup Subscriptions
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {Subscription} Body The requested subscription 
 * @apiSuccessExample Example data on success:
 * {
    "reminders": [
      1
    ],
    "_id": "{ObjectId}",
    "name": "Server SSL Cert",
    "subType": "SSL RENEWAL",
    "owner": "{ObjectId}",
    "expirationDate": "2019-07-14T00:00:00.000Z",
    "notes": "Test notes yay!",
 * }

 * @apiError 404 The subscription with the given ID was not found
 */
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
/**
 * @api {post} /subscriptions Add a subscription for the current user
 * @apiName PostSub
 * @apiGroup Subscriptions
 * @apiHeader {JWT} x-auth-token Authorization token provided at login
 * 
 * @apiSuccess {Subscription} Body The newly created subscription 
 * @apiSuccessExample Example data on success:
 * {
    "reminders": [
      1
    ],
    "_id": "{ObjectId}",
    "name": "Server SSL Cert",
    "subType": "SSL RENEWAL",
    "owner": "{ObjectId}",
    "expirationDate": "2019-07-14T00:00:00.000Z",
    "notes": "Test notes yay!",
 * }

 * @apiError 400 Error validating the subscription body, error enclosed
 */
router.post('/', auth, async (req, res, next) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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

/**
 * @api {put} /subscriptions/:id Update a subscription for the current user
 * @apiName PutSub
 * @apiGroup Subscriptions
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {Subscription} Body The updated subscription 
 * @apiSuccessExample Example data on success:
 * {
    "reminders": [
      1
    ],
    "_id": "{ObjectId}",
    "name": "Server SSL Cert",
    "subType": "SSL RENEWAL",
    "owner": "{ObjectId}",
    "expirationDate": "2019-07-14T00:00:00.000Z",
    "notes": "Test notes yay!",
 * }

 * @apiError 400 Error validating the subscription body, error enclosed
 * @apiError 404 The subscription <code>id</code> was not found
 */
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

/**
 * @api {delete} /subscriptions/:id Delete a subscription for the current user
 * @apiName DeleteSub
 * @apiGroup Subscriptions
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {String} Body Subscription deleted
   
 * @apiError 404 The subscription <code>id</code> was not found
 */
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndRemove(req.params.id);

    if (!subscription) return res.status(404).send('The subscription with the given ID was not found.');
    res.status(200).send('Subscription deleted');
  } catch (ex) {
    res.status(500).send('Bricked the phone.');
  }
});

module.exports = router;