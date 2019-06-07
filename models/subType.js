const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const subTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  }
});

const SubType = mongoose.model('SubType', subTypeSchema);

function validateSubType(subType) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(subType, schema);
}

exports.subTypeSchema = subTypeSchema;
exports.SubType = SubType;
exports.validate = validateSubType;