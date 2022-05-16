const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers");
const { getArticleByID } = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

//400 – Bad Request (PSQL error)
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  } else next(err);
});

//404 – Path not found
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Requested URL not found" });
});

//404 – Article not found
app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message });
});

//500 – Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = { app };
