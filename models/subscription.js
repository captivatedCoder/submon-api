const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Subscription = mongoose.model('Subscription', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  },
  subType: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reminders: {
    type: [Number],
    default: [1]
  }
}));

function validateSubscription(subscription) {
  const schema = {
    name: Joi.string().min(5).max(20).required(),
    subType: Joi.string().min(5).max(15).required(),
    reminders: Joi.array().items(Joi.number()),
    owner: Joi.string().required()
  };

  return Joi.validate(subscription, schema);
}

exports.Subscription = Subscription;
exports.validate = validateSubscription;