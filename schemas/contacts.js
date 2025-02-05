const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.boolean().default(false),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.boolean().default(false),
});

const updateContactStatusSchema = Joi.object({
  favorite: Joi.boolean(),
});

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
};
