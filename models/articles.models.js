const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
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
