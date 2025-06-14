const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),

    weather: Joi.string().required().valid("hot", "warm", "cold"),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
  }),
});

module.exports.validateUserRegistrationBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'avatar' field must be filled in",
      "string.uri": "The 'avatar' field must be a valid url",
    }),

    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
      "string.email": "The 'email' field must be a valid email",
    }),

    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

module.exports.validateUserLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
      "string.email": "The 'email' field must be a valid email",
    }),

    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

module.exports.validateIDParam = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).messages({
      "string.hex": "The 'id' field can only contain 0-9, A-Z, a-z characters",
      "string.length": "The 'id' field must be 24 characters long",
    }),

    itemId: Joi.string().hex().length(24).messages({
      "string.hex":
        "The 'itemId' field can only contain 0-9, A-Z, a-z characters",
      "string.length": "The 'itemId' field must be 24 characters long",
    }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'avatar' field must be filled in",
      "string.uri": "The 'avatar' field must be a valid url",
    }),
  }),
});
