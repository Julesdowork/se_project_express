const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { BadRequestError } = require("../errors/bad-request-err");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid e-mail address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  if (!email || !password) {
    return Promise.reject(new BadRequestError("Missing e-mail or password."));
  }

  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error();
        error.name = "UnauthorizedError";
        return Promise.reject(error);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error();
          error.name = "UnauthorizedError";
          return Promise.reject(error);
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
