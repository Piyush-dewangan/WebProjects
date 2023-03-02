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
  res.render("changepass.ejs", { name, err: null });
});
app.post("/changepass/changed", isAuth, (req, res) => {
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
    console.log(size);
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
//  cart items redirect pages handling the cart items
app.get("/product/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
    let products = JSON.parse(data);

    products.forEach((product) => {
      if (product.id == id) {
        console.log(id);
        res.render("item.ejs", { product: product, name: req.session.name });
        return;
      }
    });
  });
});
app.get("/addcart/:id", isAuth, (req, res) => {
  const { id } = req.params;
  fs.readFile(__dirname + "/cart.txt", "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;
    if (cart[username]) {
      if (cart[username][id]) {
        cart[username][id].quantity++;
      } else {
        cart[username][id] = {
          quantity: 1,
        };
      }
    } else {
      cart[username] = {};
      cart[username][id] = id;
      cart[username][id] = {
        quantity: 1,
      };
    }
    fs.writeFile(__dirname + "/cart.txt", JSON.stringify(cart), (err) => {
      res.redirect("/cart");
    });
  });
});
app.get("/minuscart/:id", isAuth, (req, res) => {
  const { id } = req.params;
  fs.readFile(__dirname + "/cart.txt", "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;
    if (cart[username]) {
      cart[username][id].quantity--;
    }
    fs.writeFile(__dirname + "/cart.txt", JSON.stringify(cart), (err) => {
      res.redirect("/cart");
    });
  });
});
app.get("/deletecart/:id", isAuth, (req, res) => {
  const { id } = req.params;
  fs.readFile(__dirname + "/cart.txt", "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;
    if (cart[username]) {
      if (cart[username][id]) {
        delete cart[username][id];
      }
    }
    fs.writeFile(__dirname + "/cart.txt", JSON.stringify(cart), (err) => {
      res.redirect("/cart");
    });
  });
});
app.get("/cart", isAuth, (req, res) => {
  fs.readFile(__dirname + "/cart.txt", "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;

    if (cart[username]) {
      let products;
      fs.readFile(__dirname + "/product.txt", "utf-8", (err, data) => {
        products = JSON.parse(data);

        res.render("mycart.ejs", {
          products: products,
          cart: cart[username],
          name: req.session.name,
        });
      });
    } else {
    }
  });
});

app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
