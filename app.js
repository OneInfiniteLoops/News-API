const express = require("express");
const app = express();

app.use(express.json());

//Require in functions from controllers
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleByID,
  patchVotesOfArticleByID,
  getArticles,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");

const {
  getCommentsByArticleID,
} = require("./controllers/comments.controllers");

//Require in from errors controllers
const {
  handlePSQLErrors,
  handlePathNotFoundErrors,
  handleArticleNotFoundErrors,
  handleInternalServerError,
} = require("./controllers/errors.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", patchVotesOfArticleByID);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

//Error Handling
app.use(handlePSQLErrors);
app.use("/*", handlePathNotFoundErrors);
app.use(handleArticleNotFoundErrors);
app.use(handleInternalServerError);

module.exports = { app };
