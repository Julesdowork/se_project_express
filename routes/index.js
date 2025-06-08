const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
// TODO: remove after passing code review
router.use("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now.");
  }, 0);
});
router.use("/signin", login);
router.use("/signup", createUser);
router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found." });
});

module.exports = router;
