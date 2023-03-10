const UserModal = require("../database/users");

const adminGet = async (req, res) => {
  res.render("logadmin.ejs", { error: null });
};
const adminHome = async (req, res) => {
  res.render("admin.ejs");
};
const adminLoginPost = async (req, res) => {
  let { username, password } = req.body;

  if (username != "admin" && password != "admin") {
    res.render("logadmin.ejs", {
      error: "Wrong Credentials Admin Contact head office for Credentials",
    });
  } else {
    req.session.isAdmin = true;
    res.redirect("/admin");
  }
};
const createSellerGet = async (req, res) => {
  res.render("createseller.ejs");
};
const createSellerPost = async (req, res) => {
  console.log(req.body);
  let userCurrent = new UserModal();
  userCurrent.name = req.body.name;
  userCurrent.email = req.body.email;
  (userCurrent.username = req.body.username),
    (userCurrent.password = req.body.password);
  userCurrent.mobile = req.body.mobile;
  userCurrent.isSeller = true;
  (userCurrent.isVerified = true), (userCurrent.mailToken = Date.now());

  await userCurrent.save();
  res.redirect("/admin");
};
const adminDeleteSellerGet = async (req, res) => {
  //   res.send("user to delte krna hai");
  let sellers = await UserModal.find({ isSeller: true });
  res.render("sellerscontrol.ejs", { sellers: sellers });
};
const adminSeeAllProductGet = async (req, res) => {
  res.send("your all product is loading");
};
const adminLogoutGet = (req, res) => {
  req.session.destroy();

  res.redirect("/admin");
};
module.exports = {
  adminGet,
  adminHome,
  adminLoginPost,
  createSellerGet,
  createSellerPost,
  adminDeleteSellerGet,
  adminSeeAllProductGet,
  adminLogoutGet,
};
