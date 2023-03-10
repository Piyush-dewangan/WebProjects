const ProductModal = require("../database/product");
const UserModal = require("../database/users");
const PlaceorderModal = require("../database/placeorder");
const addProductGet = async (req, res) => {
  // let user = await UserModal.findOne({ username: req.session.user.username });
  let products = await ProductModal.find({
    seller: req.session.user._id,
  });

  console.log(products, req.session.user);
  res.render("seller.ejs", {
    products: products,
    name: req.session.user.name,
    isSeller: req.session.user.isSeller,
  });
};
const deliverProductGet = async (req, res) => {
  // let products = await ProductModal.find({
  //   seller: req.session.user._id,
  // });
  let placeorders = await PlaceorderModal.find({
    seller: req.session.user._id,
  });
  console.log("deliveyr product", placeorders);
  console.log("seller id ", req.session.user._id);
  res.render("mydeliveries.ejs", {
    deliveries: placeorders,
    name: req.session.user.name,
    isSeller: req.session.user.isSeller,
  });
};
module.exports = { addProductGet, deliverProductGet };
