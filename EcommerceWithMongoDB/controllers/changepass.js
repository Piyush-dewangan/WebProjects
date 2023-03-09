const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";
const UserModal = require("../database/users");
const changePassGet = (req, res) => {
  let name = req.session.name;
  res.render("changepass.ejs", { name, err: null, isAdmin: false });
};
const changePassPost = async (req, res) => {
  let name = req.session.name;
  let pass = req.body.password1;
  let pass1 = req.body.password1;
  let pass2 = req.body.password2;

  if (pass1 != pass2) {
    let err = "Both are not same";
    res.render("changepass.ejs", { name, err, isAdmin: false });
    return;
  }

  let user = await UserModal.findOne({ email: req.session.user.email });
  user.password = pass;
  await user.save();
  res.redirect("/login");
  // res.send("password changed sucessfully");
  return;
};

module.exports = { changePassGet, changePassPost };
