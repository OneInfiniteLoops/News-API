const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    usersArray = users.rows;
    const usernameArray = usersArray.map((user) => {
      copyUsersArray = { ...usersArray };
      return { username: user.username };
    });
    return usernameArray;
  });
};
