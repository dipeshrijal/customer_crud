const Joi = require("joi");

const customerSchema = Joi.object({
  prefix: Joi.string().allow(""),
  suffix: Joi.string().allow(""),
  surname: Joi.string().required(),
  middleName: Joi.string().allow(""),
  familyName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
});

module.exports = { customerSchema };
