const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Subscription = mongoose.model('Subscription', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  subType: {
    type: String,
    enum: ["SSL RENEWAL", "DOMAIN RENEWAL", "HARDWARE WARRANTY", "FIREWALL SUPPORT LICENSE", "MISCELLANEOUS"]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expirationDate: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 1024
  },
  reminders: {
    type: [Number],
    default: [1]
  }
}));

function validateSubscription(subscription) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    subType: Joi.string().min(5).max(30).required(),
    owner: Joi.string(),
    expirationDate: Joi.string().required(),
    notes: Joi.string().required(),
    reminders: Joi.array().items(Joi.number())
  };

  return Joi.validate(subscription, schema);
}

exports.Subscription = Subscription;
exports.validate = validateSubscription;