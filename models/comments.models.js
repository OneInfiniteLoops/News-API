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
        comment_id: results.rows[0].comment_id,
        body: results.rows[0].body,
        article_id: results.rows[0].article_id,
        username: results.rows[0].author,
        votes: results.rows[0].votes,
        created_at: results.rows[0].created_at,
      };
      return postedComment;
    });
};
