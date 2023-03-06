const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";

const changePassGet = (req, res) => {
  let name = req.session.name;
  res.render("changepass.ejs", { name, err: null });
};
const changePassPost = (req, res) => {
  let name = req.session.name;
  let pass = req.body.password1;
  let pass1 = req.body.password1;
  let pass2 = req.body.password2;

  if (pass1 != pass2) {
    console.log(pass1, pass2);
    let err = "Both are not same";
    res.render("changepass.ejs", { name, err });
    return;
  }

  fs.readFile(dir, "utf-8", (err, data) => {
    let users = JSON.parse(data);
    users.forEach((value) => {
      if (value.email == req.session.user.email) {
        value.password = pass;
      }
      fs.writeFile(dir, JSON.stringify(users), (err) => {});
    });
    res.send("password changed sucessfully");
  });
};

module.exports = { changePassGet, changePassPost };
