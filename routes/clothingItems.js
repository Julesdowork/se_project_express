const router = require("express").Router();

const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateIDParam,
} = require("../middlewares/validation");

router.get("/", getClothingItem);
router.post("/", auth, validateCardBody, createClothingItem);
router.delete("/:itemId", auth, validateIDParam, deleteClothingItem);
router.put("/:itemId/likes", auth, validateIDParam, likeClothingItem);
router.delete("/:itemId/likes", auth, validateIDParam, dislikeClothingItem);

module.exports = router;
