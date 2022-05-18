const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article not found",
        });
      } else {
        return article.rows[0];
      }
    });
};

exports.updateVotesOfArticleByID = (articleId, newVote) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [newVote, articleId]
    )
    .then((results) => {
      if (!results.rows.length) {
        return Promise.reject({
          status: 404,
          message: "Article not found",
        });
      } else {
        return results.rows[0];
      }
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then((articles) => {
      return articles.rows;
    });
};
