const router = require("express").Router();
const { getCurrentUser, updateMyProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateMyProfile);

module.exports = router;
