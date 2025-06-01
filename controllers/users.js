const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { BadRequestError } = require("../errors/bad-request-err");
const { UnauthorizedError } = require("../errors/unauthorized-err");
const { NotFoundError } = require("../errors/not-found-err");
const { ConflictError } = require("../errors/conflict-err");
const { JWT_SECRET } = require("../utils/config");

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("There is no such user with the given ID."));
      } else {
        next(err);
      }
    });
};

// POST /signup
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      user.password = undefined;
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "MongoServerError") {
        next(
          new ConflictError("A user with that e-mail address already exists.")
        );
      } else {
        next(err);
      }
    });
};

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ user, token });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "UnauthorizedError") {
        next(new UnauthorizedError("Incorrect e-mail or password."));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me
const updateMyProfile = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("There is no such user with the given ID."));
      } else {
        next(err);
      }
    });
};

module.exports = { getCurrentUser, createUser, login, updateMyProfile };
