const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("GET users");
});
router.get("/:userId", (req, res) => {
  console.log("GET users by ID");
});
router.post("/", (req, res) => {
  console.log("POST user");
});

module.exports = router;