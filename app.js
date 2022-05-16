const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers");
const { getArticleByID } = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

//Error Handler: 404 – Request not found error
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Requested URL not found" });
});

//Customer Error Handler for getArticleByID (404 Error)
app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message });
});

//Error Handler: 500 – Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = { app };
