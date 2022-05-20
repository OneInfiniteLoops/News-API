const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf8").then((endpointsJSON) => {
    const parsedEndpoints = JSON.parse(endpointsJSON);
    return parsedEndpoints;
  });
};
