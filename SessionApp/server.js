const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const port = 3000;
var temp;
const ejs = require("ejs");
app.use(express.static("public"));
app.set("view-engine", "ejs");
app.set("views", __dirname + "public/home/indes.ejs");
app.use(express.urlencoded({ extended: true }));
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

app.get("/", (req, res) => {
  if (req.session.is_logged_in)
    res.sendFile(__dirname + "/public/home/index.html");
  else res.sendFile(__dirname + "/public/login/index.html");
});
app.get("/getUsername", (req, res) => {
  res.end(JSON.stringify({ name: req.session.username }));
});
app
  .route("/login")
  .get((req, res) => {
    if (req.session.is_logged_in) {
      res.redirect(`/?name=${req.body.username}`);
    } else {
      res.sendFile(__dirname + "/public/login/index.html");
    }
  })
  .post((req, res) => {
    req.session.username = req.body.username;
    req.session.is_logged_in = false;
    var one = 0;
    fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
      let user;

      if (!data) {
        user = [];
        res.redirect("/");
      } else {
        user = JSON.parse(data);
      }

      user.forEach((value) => {
        if (
          value.username == req.body.username &&
          value.password == req.body.password
        ) {
          one = 1;
          temp = req.body.username;
          console.log("correct ", one);
        }
      });
      if (one == 1) {
        req.session.is_logged_in = true;
      } else {
        req.session.is_logged_in = false;
      }
      // console.log(req.session.is_logged_in, "sdfds");
      if (one == 0) res.sendFile(__dirname + "/public/login/index2.html");
      else res.redirect("/");
    });
  });
app
  .route("/signup")
  .get((req, res) => {
    res.sendFile(__dirname + "/public/signup/index.html");
  })
  .post((req, res) => {
    let user;

    fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
      if (!data) {
        user = [];
      } else {
        user = JSON.parse(data);
      }

      user.push({ username: req.body.username, password: req.body.password });

      fs.writeFile(__dirname + "/user.txt", JSON.stringify(user), (err) => {});
    });

    req.session.is_logged_in = true;
    res.redirect("/");
  });
app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
