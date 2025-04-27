const router = require("express").Router();
const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getClothingItem);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/:itemId/likes", auth, likeClothingItem);
router.delete("/:itemId/likes", auth, dislikeClothingItem);

module.exports = router;
