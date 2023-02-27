const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");

const port = 3000;
const isAuth = require("./middleware/isAuth");
const sendEmail = require("./methods/sendEmail");
const forgotPass = require("./methods/forgotEmail");
const products = require("./methods/products");
const { users } = require("moongose/models");
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
// Password changing and forgetting options api handling
app.get("/changepass", isAuth, (req, res) => {
  let name = req.session.name;
  res.render("changepass.ejs", { name });
});
app.post("/changepass/changed", isAuth, (req, res) => {
  let name = req.session.name;
  let pass = req.body.password;

  fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
    let users = JSON.parse(data);
    users.forEach((value) => {
      if (value.email == req.session.user.email) {
        value.password = pass;
      }
      fs.writeFile(__dirname + "/user.txt", JSON.stringify(users), (err) => {});
    });
    res.send("password changed sucessfully");
  });
});
app.get("/forgot", (req, res) => {
  res.render("forgot.ejs");
});
app.post("/forgot", (req, res) => {
  fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
    let users = JSON.parse(data);
    let email = req.body.email;
    let flag = false;
    let mailToken = null;
    users.forEach((value) => {
      if (value.email == email) {
        flag = true;
        mailToken = value.mailToken;
      }
    });
    if (flag) {
      forgotPass(email, "User", mailToken, (err, data) => {});
    }
  });

  res.send("Check your Email");
});
app.get("/resetPass/:token", (req, res) => {
  const { token } = req.params;

  fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
    let users = JSON.parse(data);
    for (let i = 0; i < users.length; i++) {
      if (users[i].mailToken == token) {
        flag = true;
        req.session.name = users[i].name;
        req.session.user = users[i];
        req.session.is_logged_in = true;
        req.session.isVerified = true;
        res.redirect("/changepass");

        return;
      }
    }
  });
});
// making a get request for home if no sesssion is present redirect to login page
app.get("/home", (req, res) => {
  var products;

  fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
    products = JSON.parse(data);
    let size = 5;
    let name = null;
    if (req.session.is_logged_in) {
      name = req.session.name;
    }
    res.render("home.ejs", { name, products, size });
  });
});
app.get("/", isAuth, (req, res) => {
  let name = req.session.name;
  var products;
  console.log(req.session);
  fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
    products = JSON.parse(data);
    let size = 5;

    res.render("home.ejs", { name, products, size });
  });
});

app.get("/fetchAll", isAuth, (req, res) => {
  let name = req.session.name;
  var products;

  fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
    products = JSON.parse(data);
    let size = 24;
    res.render("home.ejs", { name, products, size });
  });
});
app.get("/verifyEmail/:token", (req, res) => {
  const { token } = req.params;
  fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
    let users = JSON.parse(data);
    for (let i = 0; i < users.length; i++) {
      if (users[i].mailToken == token) {
        users[i].isVerified = true;
        fs.writeFile(
          __dirname + "/user.txt",
          JSON.stringify(users),
          (err) => {}
        );
        req.session.user = users[i];
        req.session.is_logged_in = true;
        req.session.user.isVerified = true;
        return;
      }
    }
  });
  res.redirect("/home");
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
        fs.writeFile(__dirname + "/user.txt", JSON.stringify(user), (err) => {
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
  });
app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
