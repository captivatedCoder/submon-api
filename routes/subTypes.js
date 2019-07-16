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