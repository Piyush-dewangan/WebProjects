const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";
const loginUserGet = (req, res) => {
  let name = null;
  let error = null;
  res.render("login.ejs", { name, error });
  return;
};
const loginUserPost = (req, res) => {
  // req.session.name = req.body.name;
  let temp;
  req.session.is_logged_in = false;
  let one = 0;
  fs.readFile(dir, "utf-8", (err, data) => {
    let user;

    if (!data) {
      user = [];
      let name = null;
      let error = "Wrong Password Or Username";
      res.render("login.ejs", { name, error });
      return;
    } else {
      user = JSON.parse(data);
    }

    user.forEach((value) => {
      if (
        value.username == req.body.username &&
        value.password == req.body.password
      ) {
        one = 1;
        req.session.user = value;
        req.session.isVerified = value.isVerified;
        temp = value.name;
      }
    });
    if (one == 1) {
      req.session.is_logged_in = true;
      req.session.name = temp;
    } else {
      req.session.is_logged_in = false;
    }

    if (one == 0) {
      let name = null;
      let error = "Wrong Password Or Username";
      res.render("login.ejs", { name, error });
      return;
    } else {
      res.redirect("/");
      return;
    }
  });
};

module.exports = { loginUserGet, loginUserPost };
