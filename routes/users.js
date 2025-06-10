const router = require("express").Router();
const { getCurrentUser, updateMyProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateMyProfile);

module.exports = router;
