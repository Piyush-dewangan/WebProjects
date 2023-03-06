const fs = require("fs");
const dir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/user.txt";

const signupUserGet = (req, res) => {
  let name = null;
  let error = null;
  res.render("signup.ejs", { name, error });
  return;
};
const signupUserPost = (req, res) => {
  let user;
  let flag = false;
  fs.readFile(dir, "utf-8", (err, data) => {
    if (!data) {
      user = [];
    } else {
      user = JSON.parse(data);
    }

    for (let i = 0; i < user.length; i++) {
      let usernow = user[i];
      if (usernow.username === req.body.username) {
        flag = true;
      }
    }
    if (flag) {
      let name = null;
      let error = "User name is already taken";
      console.log(error);
      res.render("signup.ejs", { name, error });
      return;
    }
    if (!flag) {
      const userCurrent = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        mobile: req.body.mobile,
        isVerified: false,
        mailToken: Date.now(),
      };
      user.push(userCurrent);
      fs.writeFile(dir, JSON.stringify(user), (err) => {
        if (err) {
          let name = null;
          let error = "error";
          console.log(error);
          res.render("signup.ejs", { name, error });
          return;
        }
        sendEmail(
          req.body.email,
          req.body.name,
          userCurrent.mailToken,
          (err, data) => {
            if (err) {
              let name = null;
              let error = "error";
              console.log(error);
              res.render("signup.ejs", { name, error });
              return;
            } else {
              res.redirect("/login");
            }
          }
        );
      });
    }
  });
};

module.exports = { signupUserGet, signupUserPost };
