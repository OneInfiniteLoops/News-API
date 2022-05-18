const db = require("../db/connection");

exports.fetchCommentsByArticleID = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({
          status: 404,
          message: "Comments and article does not exist",
        });
      } else return article.rows[0].article_id;
    })
    .then((articleId) => {
      return db
        .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
        .then((comments) => {
          return comments.rows;
        });
    });
};
