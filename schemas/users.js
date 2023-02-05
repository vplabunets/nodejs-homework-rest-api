const Joi = require("joi");

const addUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.number(),
  subscription: Joi.string(),
  avatarURL: Joi.string(),
});

const repeatVerifyMailSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});
module.exports = {
  addUserSchema,
  repeatVerifyMailSchema,
};
