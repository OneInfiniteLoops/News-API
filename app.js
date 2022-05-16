const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);

//Error Handler: 404 – Request not found error
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Requested URL not found" });
});

//Error Handler: 500 – Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = { app };
