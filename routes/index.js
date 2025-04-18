const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use((req, res, next) => {
  req.user = {
    _id: "68004aa6d9a0fd213b9ef256",
  };

  next();
});

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR)
    .send({ message: "Requested resource not found." });
});

module.exports = router;
