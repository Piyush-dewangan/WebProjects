const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";

const forgetUserGet = (req, res) => {
  res.render("forgot.ejs");
};

const forgetUserPost = (req, res) => {
  fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
    let users = JSON.parse(data);
    let email = req.body.email;
    let flag = false;
    let mailToken = null;
    users.forEach((value) => {
      if (value.email == email) {
        flag = true;
        mailToken = value.mailToken;
      }
    });
    if (flag) {
      forgotPass(email, "User", mailToken, (err, data) => {});
    }
  });

  res.send("Check your Email");
};
module.exports = { forgetUserGet, forgetUserPost };
