const express = require("express");

const indexController = require("../controllers/indexController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to project Odin-Book (WIP)" });
});

router.post("/login", indexController.login_post);

router.post("/signup", indexController.signup_post);

router.get("/user", indexController.user_detail);

module.exports = router;
