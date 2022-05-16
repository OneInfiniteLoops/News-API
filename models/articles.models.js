const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Requested URL not found",
        });
      } else {
        return article.rows[0];
      }
    });
};
