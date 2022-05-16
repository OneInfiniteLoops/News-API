const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    // console.log(topics, "FROM MODELS");
    return topics.rows;
  });
};
