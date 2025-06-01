const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use("/signin", login);
router.use("/signup", createUser);
router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found." });
});

module.exports = router;
