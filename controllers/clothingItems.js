const ClothingItem = require("../models/clothingItems");
const { BadRequestError } = require("../errors/bad-request-err");
const { ForbiddenError } = require("../errors/forbidden-err");
const { NotFoundError } = require("../errors/not-found-err");

// GET /items
const getClothingItem = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

// POST /items
const createClothingItem = (req, res, next) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else {
        next(err);
      }
    });
};

// DELETE /items/:id
const deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError("Cannot delete someone else's item.");
      }

      item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Successfully deleted." }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("There is no such clothing item with the given ID.")
        );
      } else {
        next(err);
      }
    });
};

// PUT /items/:id/likes
const likeClothingItem = (req, res, next) => {
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
      if (err.name === "CastError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("There is no such clothing item with the given ID.")
        );
      } else {
        next(err);
      }
    });
};

// DELETE /items/:id/likes
const dislikeClothingItem = (req, res, next) => {
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
      if (err.name === "CastError") {
        next(
          new BadRequestError("The required data has been entered incorrectly.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("There is no such clothing item with the given ID.")
        );
      } else {
        next(err);
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
