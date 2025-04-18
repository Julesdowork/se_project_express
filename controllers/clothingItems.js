const ClothingItem = require("../models/clothingItems");
const {
  INVALID_DATA_ERROR,
  NO_DOCUMENT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// GET /items
const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: err.message });
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
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

// DELETE /items/:id
const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NO_DOCUMENT_FOUND_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

// PUT /items/:id/likes

// DELETE /items/:id/likes

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
