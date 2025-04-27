const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// GET /users/me
const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: "There is no such user with the given ID." });
      } else if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The required data has been entered incorrectly." });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// POST /signup
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const {password, ...userWithoutPassword} = user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({
          message: "The required data has been entered incorrectly.",
        });
      } else if (err.name === "MongoServerError") {
        res
          .status(CONFLICT_ERROR)
          .send({ message: "User with that e-mail address already exists." });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({
          message: "The required data has been entered incorrectly.",
        });
      } else if (err.name === "UnauthorizedError") {
        res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Incorrect e-mail or password." });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// PATCH /users/me
const updateMyProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: "There is no such user with the given ID." });
      } else if (err.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The required data has been entered incorrectly." });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = { getCurrentUser, createUser, login, updateMyProfile };
