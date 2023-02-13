const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const bodyParser = require("body-parser");
const port = 3000;
app.set("view-engine", "ejs");
// var expressLayouts = require("express-ejs-layouts");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// app.use(expressLayouts);
// const { body, validationResult } = require("express-validator");
// app.set("views", __dirname + "public/home/indes.ejs");

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // Session expires after 1 min of inactivity.
      expires: 60000,
    },
  })
);
// making a get request for home if no sesssion is present redirect to login page
app.get("/", (req, res) => {
  if (req.session.is_logged_in) {
    const { name } = req.query;

    res.render("home.ejs", { name });
  } else {
    const name = null;
    res.render("login.ejs", { name });
  }
});
app.get("/getUsername", (req, res) => {
  res.end(JSON.stringify({ name: req.session.username }));
});
app
  .route("/login")
  .get((req, res) => {
    const name = null;
    res.render("login.ejs", { name });
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
        const name = null;
        res.render("login2.ejs", { name });
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
      } else {
        req.session.is_logged_in = false;
      }
      // console.log(req.session.is_logged_in, "sdfds");
      if (one == 0) {
        const name = null;
        res.render("login2.ejs", { name });
      } else {
        res.redirect(`/?name=${temp}`);
      }
    });
  });
app
  .route("/signup")
  .get((req, res) => {
    const name = null;
    res.render("signup.ejs", { name });
  })
  .post((req, res) => {
    let user;

    fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
      if (!data) {
        user = [];
      } else {
        user = JSON.parse(data);
      }

      user.push({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });

      fs.writeFile(__dirname + "/user.txt", JSON.stringify(user), (err) => {});
    });

    req.session.is_logged_in = true;

    res.redirect(`/?name=${req.body.name}`);
  });
app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
