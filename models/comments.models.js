const db = require("../db/connection");

exports.fetchCommentsByArticleID = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({
          status: 404,
          message: "Comments and article does not exist",
        });
      } else {
        return comments.rows;
      }
    });
};
