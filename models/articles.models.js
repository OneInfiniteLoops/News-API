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

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "ASC", "desc", "DESC"];
  const queryValues = [];

  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, 
  COUNT(comments.article_id) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "400 - Invalid Query" });
  }

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE articles.topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  // if (validSortBy.includes(sort_by)) {
  //   queryStr += ` ORDER BY ${sort_by}`;
  //   if ((validOrder.includes(order) && order === "asc") || order === "ASC") {
  //     queryStr += ` ASC`;
  //   } else if (order && !validOrder.includes(order)) {
  //     return Promise.reject({ status: 400, message: "400 - Invalid Query" });
  //   }
  // } else {
  //   return Promise.reject({ status: 400, message: "400 - Invalid Query" });
  // }

  return db.query(queryStr, queryValues).then((articles) => {
    if (!articles.rows.length) {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then((result) => {
          if (!result.rows.length) {
            return Promise.reject({
              status: 404,
              message: "No topic found",
            });
          } else return articles.rows;
        });
    } else return articles.rows;
  });
};
