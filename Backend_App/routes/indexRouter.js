const express = require("express");

const indexController = require("../controllers/indexController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to project Odin-Book (WIP)" });
});

router.get("test1", indexController.test1);

module.exports = router;
