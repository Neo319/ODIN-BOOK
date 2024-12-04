require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 2000;
//starting app
const app = express();

//parsing json payloads
app.use(express.json());

app.use("/", (req, res) => {
  res.send("Welcome to the app. (WIP)");
});

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
