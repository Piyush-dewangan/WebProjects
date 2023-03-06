const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const port = 3000;
//  MIddlewares importing
const isAuth = require("./middleware/isAuth");
const sendEmail = require("./methods/sendEmail");
const forgotPass = require("./methods/forgotEmail");
const products = require("./methods/products");

// Routes to Apis
const login_routes = require("./routes/login");
const changepass_routes = require("./routes/changepass");
const forget_routes = require("./routes/forget");
const signup_routes = require("./routes/signup");
const product_routes = require("./routes/product");
const cart_routes = require("./routes/cart");
const resetPass_routes = require("./routes/resetpass");
const admin_routes = require("./routes/admin");
const placeorder_routes = require("./routes/placeorder");
// data base connectivity and calling
const initDB = require("./database/init");

initDB().catch((err) => console.log(err));
const ProductModal = require("./database/product");
const UserModal = require("./database/users");
// default middle wares to use
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/fetchAll/uploads", express.static(__dirname + "/uploads"));
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
app.use("/resetPass", resetPass_routes);
app.use("/admin", admin_routes);
app.use("/placeorder", placeorder_routes);

// Password changing and Email Verification

app.get("/verifyEmail/:token", async (req, res) => {
  const { token } = req.params;

  let user = await UserModal.find({ mailToken: token });

  if (user !== null) {
    let newuser = await UserModal.updateOne(
      { mailToken: token },
      { $set: { isVerified: true } }
    );

    req.session.user = newuser;
    req.session.is_logged_in = true;
    req.session.user.isVerified = true;
  }

  res.redirect("/home");
});

// making a get request for home if no sesssion is present redirect to login page
app.get("/home", async (req, res) => {
  let products = await ProductModal.find({});
  console.log(__dirname);
  let size = 5;
  let name = null;
  let isAdmin = false;

  if (req.session.is_logged_in) {
    name = req.session.name;
    isAdmin = req.session.user.isAdmin;
  }
  res.render("home.ejs", { name, products, size, isAdmin });
});
app.get("/", isAuth, async (req, res) => {
  let name = req.session.name;
  let isAdmin = req.session.user.isAdmin;
  let products = await ProductModal.find({});
  let size = 5;
  res.render("home.ejs", { name, products, size, isAdmin });
});

app.get("/fetchAll/:size", async (req, res) => {
  let name = req.session.name;
  let products = await ProductModal.find({});
  let isAdmin = false;
  const size = req.params.size;
  if (req.session.is_logged_in) {
    name = req.session.name;
    isAdmin = req.session.user.isAdmin;
  }

  res.render("home.ejs", { name, products, size, isAdmin });
});

app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
