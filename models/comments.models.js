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

exports.addCommentByArticleID = (articleId, newComment) => {
  const { username, body } = newComment;

  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1,$2,$3) RETURNING *;`,
      [articleId, username, body]
    )
    .then((results) => {
      const postedComment = {
        username: results.rows[0].author,
        body: results.rows[0].body,
      };
      return postedComment;
    });
};
