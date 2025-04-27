const ClothingItem = require("../models/clothingItems");
const {
  INVALID_DATA_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// GET /items
const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST /items
const createClothingItem = (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
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

// DELETE /items/:id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const owner = req.user._id;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (itemId !== owner) {
        const assertionError = new Error();
        assertionError.name = "AssertionError";
        return Promise.reject(assertionError);
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The required data has been entered incorrectly." });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({
          message: "There is no such clothing item with the given ID.",
        });
      } else if (err.name === "AssertionError") {
        res
          .status(FORBIDDEN_ERROR)
          .send({ message: "Cannot delete someone else's item." });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// PUT /items/:id/likes
const likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The required data has been entered incorrectly." });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({
          message: "There is no such clothing item with the given ID.",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// DELETE /items/:id/likes
const dislikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The required data has been entered incorrectly." });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({
          message: "There is no such clothing item with the given ID.",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
