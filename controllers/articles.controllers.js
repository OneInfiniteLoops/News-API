const {
  fetchArticleByID,
  updateVotesOfArticleByID,
  fetchArticles,
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

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;
  // const promiseAllArray = [fetchArticles(sort_by, order, topic)];

  // const checkTopicExists = db.query(`SELECT * FROM topics WHERE topic=$1`, [
  //   topic,
  // ]);

  // if (topic) {
  //   promiseAllArray.push(checkTopicExists);
  // }
  // Promise.all(promiseAllArray).then(([articles]) => {
  //   res.status(200).send({ articles });
  // });

  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
