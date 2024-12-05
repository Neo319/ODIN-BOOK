require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 2000;
//starting app
const app = express();

const router = require("./routes/indexRouter.js");

//parsing json payloads
app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
