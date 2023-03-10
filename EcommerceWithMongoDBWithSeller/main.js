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
const seller_routes = require("./routes/seller");
const placeorder_routes = require("./routes/placeorder");
const admin_routes = require("./routes/admin");
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
app.use("/placeorder/uploads", express.static(__dirname + "/uploads"));
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
app.use("/seller", seller_routes);
app.use("/placeorder", placeorder_routes);
app.use("/admin", admin_routes);

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
  let name = null;
  let isSeller = false;
  let page = 1;
  let limit = 5;
  let skip = (page - 1) * limit;
  let products = await ProductModal.find({}).skip(skip).limit(limit);
  if (req.session.is_logged_in) {
    name = req.session.name;
    isSeller = req.session.user.isSeller;
  }
  res.render("home.ejs", { name, products, page, isSeller });
});
app.get("/", isAuth, async (req, res) => {
  let name = req.session.name;
  let isSeller = req.session.user.isSeller;
  let page = 1;
  let limit = 5;
  let skip = (page - 1) * limit;
  let products = await ProductModal.find({}).skip(skip).limit(limit);
  console.log(products);
  res.render("home.ejs", { name, products, page, isSeller });
});

app.get("/fetchAll/:page", async (req, res) => {
  let name = req.session.name;

  const page = req.params.page;
  let limit = 5;
  let skip = (page - 1) * limit;
  let products = await ProductModal.find({}).skip(skip).limit(limit);
  let isSeller = false;
  if (req.session.is_logged_in) {
    name = req.session.name;
    isSeller = req.session.user.isSeller;
  }

  res.render("home.ejs", { name, products, page, isSeller });
});

app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});
