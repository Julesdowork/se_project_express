const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../errors/not-found-err");
const {
  validateUserRegistrationBody,
  validateUserLoginBody,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
// TODO: remove after passing code review
router.use("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now.");
  }, 0);
});
router.use("/signin", validateUserLoginBody, login);
router.use("/signup", validateUserRegistrationBody, createUser);
router.use((req, res) => {
  throw new NotFoundError("The requested resource could not be found.");
});

module.exports = router;
