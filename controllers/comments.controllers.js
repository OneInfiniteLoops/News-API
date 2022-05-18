const { fetchCommentsByArticleID } = require("../models/comments.models");

exports.getCommentsByArticleID = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchCommentsByArticleID(articleId).then((comments) => {
    res.status(200).send({ comments });
  });
};
