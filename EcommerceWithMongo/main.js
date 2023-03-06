const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");

const port = 3000;
const isAuth = require("./middleware/isAuth");
const sendEmail = require("./methods/sendEmail");
const forgotPass = require("./methods/forgotEmail");
const products = require("./methods/products");

const login_routes = require("./routes/login");
const changepass_routes = require("./routes/changepass");
const forget_routes = require("./routes/forget");
const signup_routes = require("./routes/signup");
const product_routes = require("./routes/product");
const cart_routes = require("./routes/cart");

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
app.use("/login", login_routes);
app.use("/changepass", changepass_routes);
app.use("/forgot", forget_routes);
app.use("/signup", signup_routes);
app.use("/product", product_routes);
app.use("/cart", cart_routes);

// Password changing and Email Verification

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

  fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
    products = JSON.parse(data);
    let size = 5;

    res.render("home.ejs", { name, products, size });
  });
});

app.get("/fetchAll/:size", (req, res) => {
  let name = req.session.name;
  var products;
  const size = req.params.size;

  fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
    products = JSON.parse(data);

    res.render("home.ejs", { name, products, size });
  });
});

app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
