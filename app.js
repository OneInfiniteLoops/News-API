const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleByID,
  patchVotesOfArticleByID,
} = require("./controllers/articles.controllers");

const {
  handlePSQLErrors,
  handlePathNotFoundErrors,
  handleArticleNotFoundErrors,
  handleInternalServerError,
} = require("./controllers/errors.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", patchVotesOfArticleByID);

//Error Handling
app.use(handlePSQLErrors);
app.use("/*", handlePathNotFoundErrors);
app.use(handleArticleNotFoundErrors);
app.use(handleInternalServerError);

module.exports = { app };
