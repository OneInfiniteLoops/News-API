const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    // console.log({ topics }, "FROM CONTROLLER");
    res.status(200).send({ topics });
  });
};
