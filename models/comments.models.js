const db = require("../db/connection");

exports.fetchCommentsByArticleID = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then((comments) => {
      return comments.rows;
    });
};
