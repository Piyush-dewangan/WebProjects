const UserModal = require("../database/users");

const fs = require("fs");

const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";
const loginUserGet = (req, res) => {
  let name = null;
  let error = null;
  res.render("login.ejs", { name, error, isSeller: false });
  return;
};
const loginUserPost = async (req, res) => {
  let user = await UserModal.findOne({ username: req.body.username });

  if (user == null || user.password !== req.body.password) {
    let name = null;
    let error = "Wrong Password Or Username";
    res.render("login.ejs", { name, error, isSeller: false });
    return;
  } else {
    if (
      user.username == req.body.username &&
      user.password == req.body.password
    ) {
      req.session.user = user;
      req.session.isVerified = user.isVerified;

      req.session.is_logged_in = true;
      req.session.name = user.name;

      res.redirect("/");
      return;
    }
  }
};

module.exports = { loginUserGet, loginUserPost };
