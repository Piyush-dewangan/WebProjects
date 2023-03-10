const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";
const UserModal = require("../database/users");
const sendEmail = require("../methods/sendEmail");
const signupUserGet = (req, res) => {
  let name = null;
  let error = null;
  res.render("signup.ejs", { name, error, isSeller: false });
  return;
};
const signupUserPost = async (req, res) => {
  let user = await UserModal.findOne({ username: req.body.username });

  let flag = false;

  if (user !== null) {
    let name = null;
    let error = "User name is already taken";

    res.render("signup.ejs", { name, error, isSeller: false });
    return;
  } else {
    let userCurrent = new UserModal();
    userCurrent.name = req.body.name;
    userCurrent.email = req.body.email;
    (userCurrent.username = req.body.username),
      (userCurrent.password = req.body.password);
    userCurrent.mobile = req.body.mobile;
    (userCurrent.isVerified = false), (userCurrent.mailToken = Date.now());

    userCurrent.save();

    sendEmail(
      req.body.email,
      req.body.name,
      userCurrent.mailToken,
      (err, data) => {
        if (err) {
          let name = null;
          let error = "error";
          console.log(error);
          res.render("signup.ejs", { name, error, isSeller: false });
          return;
        } else {
          res.redirect("/login");
        }
      }
    );
  }
};

module.exports = { signupUserGet, signupUserPost };
