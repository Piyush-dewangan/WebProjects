const fs = require("fs");

const users = function () {
  fs.readFile(__dirname + "/users.txt", "utf-8", (err, data) => {
    let user;
    if (!data) {
      user = [];
    } else {
      user = JSON.parse(data);
    }
    return user;
  });
};
module.exports = users;
