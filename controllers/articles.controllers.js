const {
  fetchArticleByID,
  updateVotesOfArticleByID,
} = require("../models/articles.models");

exports.getArticleByID = (req, res, next) => {
  fetchArticleByID(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesOfArticleByID = (req, res, next) => {
  const articleId = req.params.article_id;
  const newVote = req.body.inc_votes;
  updateVotesOfArticleByID(articleId, newVote)
    .then((updatedArticle) => {
      res.status(202).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
