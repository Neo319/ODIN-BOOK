const express = require("express");

const indexController = require("../controllers/indexController");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to project Odin-Book (WIP)" });
});

router.post("/login", indexController.login_post);

router.post("/signup", indexController.signup_post);

router.get("/user", indexController.user_detail);

//routes related to user manipulation

// temp
router.get("/test1", usersController.test1);

router.get("/searchUsers", usersController.user_search);

module.exports = router;
