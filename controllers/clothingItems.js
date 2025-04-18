const ClothingItem = require("../models/clothingItems");

// GET /items
const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message });
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
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// DELETE /items/:itemId
const deleteClothingItem = (req, res) => {
  console.log(req.params.id);
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
