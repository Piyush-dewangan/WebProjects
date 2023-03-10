const CartModal = require("../database/cart");
const ProductModal = require("../database/product");
const PlaceorderModal = require("../database/placeorder");
const { v4: uuidv4 } = require("uuid");

const placeOrderGet = async (req, res) => {
  let cart = await CartModal.findOne({ username: req.session.user.username });
  let product = await ProductModal.find({});
  // console.log(cart);
  res.render("placeorder.ejs", {
    name: req.session.user.name,
    isAdmin: req.session.user.isAdmin,
    cart: cart.cartitems,
    product: product,
  });
};
const placedOrderPost = async (req, res) => {
  let cart = await CartModal.findOne({ username: req.session.user.username });
  // let product = await ProductModal.find({});
  let placeorder = new PlaceorderModal();
  // console.log(cart);
  let { total } = req.params;
  console.log("req boyd", req.body);
  placeorder.username = cart.username;
  placeorder.address = req.body.address;
  placeorder.items = cart.cartitems;
  placeorder.id = uuidv4();
  await placeorder.save();
  await CartModal.deleteOne({ username: req.session.user.username });
  res.json("Your Order Placed SucessFully");
  // res.redirect("/placeorder/myorders");
};

const placedOrderGet = async (req, res) => {
  // res.send("sucess");
  let placeorder = await PlaceorderModal.find({
    username: req.session.user.username,
  });
  // console.log(req.session);
  let product = await ProductModal.find({});
  // console.log(placeorder);
  res.render("myorders.ejs", {
    name: req.session.user.name,
    product: product,
    placeorder: placeorder,
    isAdmin: req.session.user.isAdmin,
  });
};
const placedOrderDelete = async (req, res) => {
  let { id, name } = req.params;
  console.log(id, name);
};
module.exports = {
  placeOrderGet,
  placedOrderPost,
  placedOrderGet,
  placedOrderDelete,
};
