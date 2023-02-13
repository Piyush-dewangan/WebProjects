const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");

const port = 3000;
const isAuth = require("./middleware/isAuth");
const sendEmail = require("./methods/sendEmail");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // Session expires after 10 min of inactivity.
      expires: 600000,
    },
  })
);
// making a get request for home if no sesssion is present redirect to login page
app.get("/", isAuth, (req, res) => {
  let name = req.session.name;

  res.render("home.ejs", { name });
});
app.get("/getUsername", (req, res) => {
  res.end(JSON.stringify({ name: req.session.username }));
});
app
  .route("/login")
  .get((req, res) => {
    let name = null;
    let error = null;
    res.render("login.ejs", { name, error });
    return;
  })
  .post((req, res) => {
    // req.session.name = req.body.name;
    let temp;
    req.session.is_logged_in = false;
    let one = 0;
    fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
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

          temp = value.name;
        }
      });
      if (one == 1) {
        req.session.is_logged_in = true;
        req.session.name = temp;
      } else {
        req.session.is_logged_in = false;
      }
      // console.log(req.session.is_logged_in, "sdfds");
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
  });
app
  .route("/signup")
  .get((req, res) => {
    let name = null;
    let error = null;
    res.render("signup.ejs", { name, error });
    return;
  })
  .post((req, res) => {
    let user;
    let flag = false;
    fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
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
        let error = "error";
        console.log(error);
        res.render("signup.ejs", { name, error });
        return;
      }
      if (!flag) {
        user.push({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          mobile: req.body.mobile,
        });
      }
      fs.writeFile(__dirname + "/user.txt", JSON.stringify(user), (err) => {
        if (err) {
          let name = null;
          let error = "error";
          console.log(error);
          res.render("signup.ejs", { name, error });
          return;
        }
        sendEmail("vyogesh624@gmail.com", (err, data) => {
          if (err) {
            let name = null;
            let error = "error";
            console.log(error);
            res.render("signup.ejs", { name, error });
            return;
          } else {
            res.redirect("/login");
          }
        });
      });
    });
  });
app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
