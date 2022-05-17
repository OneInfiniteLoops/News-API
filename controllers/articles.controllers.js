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
  const article_id = req.params.article_id;
  const newVote = req.body.inc_votes;
  updateVotesOfArticleByID(article_id, newVote).then((updatedArticle) => {
    res.status(202).send({ updatedArticle });
  });
};
