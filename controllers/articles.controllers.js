const { fetchArticleByID } = require("../models/articles.models");

exports.getArticleByID = (req, res, next) => {
  fetchArticleByID(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
