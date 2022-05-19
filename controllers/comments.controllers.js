const {
  fetchCommentsByArticleID,
  addCommentByArticleID,
} = require("../models/comments.models");

exports.getCommentsByArticleID = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchCommentsByArticleID(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleID = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = req.body;

  addCommentByArticleID(articleId, newComment)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
