require("dotenv").config();

const cors = require("cors");
const express = require("express");
const port = process.env.PORT || 2000;
//starting app
const app = express();

const router = require("./routes/indexRouter.js");

//parsing json payloads
app.use(express.json());

// allowing requests from appropriate origins
const allowedOrigins =
  process.env.NODE_ENV === "dev"
    ? "*" // development env
    : ["placeholder"]; // production env

app.use(
  cors({
    origin: allowedOrigins,
    methods: "POST, GET, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", router);

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
