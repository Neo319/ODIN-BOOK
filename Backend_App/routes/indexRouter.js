const express = require("express");

const indexController = require("../controllers/indexController");
const usersController = require("../controllers/usersController");
const postsController = require("../controllers/postsController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to project Odin-Book (WIP)" });
});

router.post("/login", indexController.login_post);

router.post("/signup", indexController.signup_post);

router.get("/user", indexController.user_detail);

// --- routes related to user manipulation ---
router.get("/searchUsers", usersController.user_search);

router.post("/follow/:userId", usersController.follow_user);

// --- routes related to posts ---
router.get("/postTest", postsController.test);

router.post("/post", postsController.create_post);

module.exports = router;
