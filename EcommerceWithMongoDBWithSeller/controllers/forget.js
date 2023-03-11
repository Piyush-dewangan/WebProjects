const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";
const forgotPass = require("../methods/forgotEmail");
const UserModal = require("../database/users");
const forgetUserGet = (req, res) => {
  res.render("forgot.ejs");
};

const forgetUserPost = async (req, res) => {
  let email = req.body.email;
  let user = await UserModal.findOne({ email: req.body.email });

  if (user !== null) {
    let mailToken = user.mailToken;
    forgotPass(email, "User", mailToken, (err, data) => {
      res.send("Check your Email");
    });
  } else {
    res.send("please enter a valid email id");
  }
};
module.exports = { forgetUserGet, forgetUserPost };
