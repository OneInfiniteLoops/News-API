exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
  } else next(err);
};

exports.handlePathNotFoundErrors = (req, res, next) => {
  res.status(404).send({ message: "Requested URL not found" });
};

exports.handleArticleNotFoundErrors = (err, req, res, next) => {
  res.status(err.status).send({ message: err.message });
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};
