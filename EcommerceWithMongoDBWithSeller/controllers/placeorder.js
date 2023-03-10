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
    isSeller: req.session.user.isSeller,
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
  // placeorder.username = cart.username;
  placeorder.address = req.body.address;
  placeorder.items = cart.cartitems;
  placeorder.id = req.session.user._id;
  placeorder.seller = cart.seller;
  placeorder.username = req.session.user.username;
  placeorder.name = req.session.user.name;
  await placeorder.save();
  await CartModal.deleteOne({ username: req.session.user.username });
  res.json("Your Order Placed SucessFully");
  // res.redirect("/placeorder/myorders");
};

const placedOrderGet = async (req, res) => {
  let placeorder = await PlaceorderModal.find({
    id: req.session.user._id,
  });
  // console.log(req.session);
  let product = await ProductModal.find({});
  console.log("placed order", placeorder);
  res.render("myorders.ejs", {
    name: req.session.user.name,
    product: product,
    placeorder: placeorder,
    isSeller: req.session.user.isSeller,
  });
};
const placedOrderDelete = async (req, res) => {
  let { _id, id } = req.params;
  let placeorder = await PlaceorderModal.findOne({ _id: _id });
  console.log(_id, id);
  console.log("current user ka place order", placeorder);
  let cartitems = placeorder.items;
  // console.log("current user ka place order items", cartitems.length);
  if (cartitems.length == 1) {
    let deleteorder = await PlaceorderModal.deleteOne({ _id: _id });
    res.redirect("/placeorder/myorders");
    return;
  }
  cartitems = cartitems.filter((cartitem) => {
    return cartitem.id == id;
  });
  console.log("current user ka place order items", cartitems);
  let updateorder = await PlaceorderModal.updateOne(
    { _id: _id },
    { $set: { items: cartitems } }
  );
  res.redirect("/placeorder/myorders");
};
module.exports = {
  placeOrderGet,
  placedOrderPost,
  placedOrderGet,
  placedOrderDelete,
};
