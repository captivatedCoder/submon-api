const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  SubType,
  validate
} = require('../models/subType');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * @api {get} /subtypes/ Get all subscription types
 * @apiName GetSubType
 * @apiGroup SubType
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {String} Body User information
 * @apiSuccessExample Example data on success:
   {     
      "_id": "5cf9883d70c7e2e9aef4465f",
      "name": "SSL RENEWAL"
   }
 * @apiError 404 No subscription types found
 */
router.get('/', auth, async (req, res) => {
  try {
    const subTypes = await SubType.find()
      .select("-__v")
      .sort("name");

    if (!subTypes) return res.status(404).send('No subscription types found')

    res.send(subTypes);
  } catch (ex) {
    res.status(500).send(ex)
  }

});

/**
 * @api {get} /subtype/:id Get a specific subscription type
 * @apiName GetOneSubType
 * @apiGroup SubType
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {SubType} Body The requested subscription type
 * @apiSuccessExample Example data on success:
 *{
   "_id": "5cf9883d70c7e2e9aef4465f",
   "name": "SSL RENEWAL"
 }
 * @apiError 404 The subscription type with the given ID was not found
 */
router.get("/:id", [auth, admin, validateObjectId], async (req, res) => {
  try {
    const subType = await SubType.findById(req.params.id).select("-__v");

    if (!subType)
      return res.status(404).send("The subscription type with the given ID was not found.");

    res.send(subType);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

/**
 * @api {post} /subtypes Add a subscription type
 * @apiName PostSubType
 * @apiGroup SubType
 * @apiHeader {JWT} x-auth-token Authorization token provided at login
 * 
 * @apiSuccess {SubType} Body The newly created subscription type
 * @apiSuccessExample Example data on success:
 *{
   "_id": "5cf9883d70c7e2e9aef4465f",
   "name": "SSL RENEWAL"
 *}

 * @apiError 400 Error validating the subscription type body, error enclosed
 * @apiError 500 Subscription Type already exists
 */
router.post("/", [auth, admin], async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let subType = new SubType({
    name: req.body.name
  });

  try {
    subType = await subType.save();

    res.send(subType);
  } catch (ex) {
    if(ex.code === 11000 && ex.name === "MongoError"){
      res.status(500).send('Subscription Type already exists');
    }
    res.status(500).send(ex);
  }
});

/**
 * @api {put} /subtype/:id Update a subscription type
 * @apiName PutSubType
 * @apiGroup SubType
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {SubType} Body The updated subscription type
 * @apiSuccessExample Example data on success:
 *{
   "_id": "5cf9883d70c7e2e9aef4465f",
   "name": "SSL RENEWAL" *
 }

 * @apiError 400 Error validating the subscription type body, error enclosed
 * @apiError 404 The subscription type with given ID was not found
 */
router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const subType = await SubType.findByIdAndUpdate(
      req.params.id, {
        name: req.body.name
      }, {
        new: true
      }
    );

    if (!subType)
      return res.status(404).send("The subscription type with the given ID was not found.");

    res.send(subType);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

/**
 * @api {delete} /subtype/:id Delete a subscription type
 * @apiName DeleteSubType
 * @apiGroup SubType
 * @apiHeader {JWT} x-auth-token Authorization token provided at login

 * @apiSuccess {String} Body Subscription type deleted
   
 * @apiError 404 The subscription type with the given ID was not found
 */
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  try {
    const subType = await SubType.findByIdAndRemove(req.params.id);

    if (!subType)
      return res.status(404).send("The subscription type with the given ID was not found.");

    res.status(200).send('Subscription type deleted');
  } catch (ex) {
    res.status(500).send(ex);
  }
});

module.exports = router;