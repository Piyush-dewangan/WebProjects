const fs = require("fs");
const cartdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/cart.txt";

const productdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/product.txt";
const uploadsdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/";

const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const ProductModal = require("../database/product");
const CartModal = require("../database/cart");
const productGet = async (req, res) => {
  const { id } = req.params;
  let product = await ProductModal.findOne({ id: id });

  res.render("item.ejs", {
    product: product,
    name: req.session.name,
    isSeller: req.session.user.isSeller,
  });
  return;
};
const addcartmoreGet = async (req, res) => {
  const { id } = req.params;
  let { username } = req.session.user;
  let cart = await CartModal.findOne({ username: username });
  let quantity;
  if (cart !== null) {
    let not_in_cart = true;
    cart.cartitems.forEach((value) => {
      if (value.id == id) {
        value.quantity = value.quantity + 1;
        quantity = value.quantity;
        not_in_cart = false;
      }
    });
    if (not_in_cart) {
      let cartItem = new Object({
        id: id,
        quantity: 1,
      });
      cart.cartitems.push(cartItem);
      let cartup = await CartModal.updateOne(
        { username: username },
        { $set: { cartitems: cart.cartitems } }
      );
      quantity = 1;
    }

    let cartup = await CartModal.updateOne(
      { username: username },
      { $set: { cartitems: cart.cartitems } }
    );
  } else {
    let usercart = new CartModal();
    usercart.username = username;
    let cartItem = new Object({
      id: id,
      quantity: 1,
    });
    usercart.cartitems.push(cartItem);
    await usercart.save();
    quantity = 1;
  }
  res.send(JSON.stringify(quantity));
};
const addcartGet = async (req, res) => {
  const { id } = req.params;
  let { username } = req.session.user;
  let cart = await CartModal.findOne({ username: username });
  let product = await ProductModal.findOne({ id: id });
  let quantity;
  if (cart !== null) {
    let not_in_cart = true;
    cart.cartitems.forEach((value) => {
      if (value.id == id) {
        value.quantity = value.quantity + 1;
        quantity = value.quantity;
        not_in_cart = false;
      }
    });
    if (not_in_cart) {
      let cartItem = new Object({
        id: id,
        quantity: 1,
      });
      cart.cartitems.push(cartItem);
      let cartup = await CartModal.updateOne(
        { username: req.session.user.username },
        { $set: { cartitems: cart.cartitems } }
      );
      quantity = 1;
    }

    let cartup = await CartModal.updateOne(
      { username: req.session.user.username },
      { $set: { cartitems: cart.cartitems } }
    );
    res.redirect("/cart");
  } else {
    let usercart = new CartModal();
    usercart.user = req.session.user._id;
    usercart.seller = product.seller;
    usercart.username = req.session.user.username;
    let cartItem = new Object({
      id: id,
      quantity: 1,
    });
    usercart.cartitems.push(cartItem);
    await usercart.save();
    quantity = 1;
    res.redirect("/cart");
  }
  // res.send(JSON.stringify(quantity));
};

const minusGet = async (req, res) => {
  const { id } = req.params;

  let { username } = req.session.user;
  let quantity;
  let cart = await CartModal.findOne({ user: req.session.user._id });

  if (cart !== null) {
    cart.cartitems.forEach((value) => {
      if (value.id == id) {
        value.quantity = value.quantity - 1;
        quantity = value.quantity;
      }
    });

    let cartup = await CartModal.updateOne(
      { user: req.session.user._id },
      { $set: { cartitems: cart.cartitems } }
    );
  }
  res.send(JSON.stringify(quantity));
};
const deletecartGet = async (req, res) => {
  const { id } = req.params;
  let { username } = req.session.user;
  let cart = await CartModal.findOne({ user: req.session.user._id });

  let newcart = cart.cartitems.filter((element) => {
    return element.id !== id;
  });
  let cartup = await CartModal.updateOne(
    { user: req.session.user._id },
    { $set: { cartitems: newcart } }
  );
  res.redirect("/cart");
};
const productUpdatePost = async (req, res) => {
  // console.log("ss", req.body);
  let { id } = req.params;

  let product = await ProductModal.updateOne(
    { id: id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
      },
    }
  );
  res.send(JSON.stringify("success"));
};
const productDeletePost = async (req, res) => {
  // console.log("ss", req.body);
  let { id } = req.params;

  let product = await ProductModal.deleteOne({ id: id });
  res.redirect("/seller");
};
const addProductPost = async (req, res) => {
  // console.log(req.body);

  // console.log(uuidv1());

  let product = new ProductModal();
  // product;
  product.seller = req.session.user._id;
  product.name = req.body.name;
  product.description = req.body.desc;
  product.id = Math.floor(Math.random() * 1000000 + 30);
  product.quantity = req.body.quantity;
  product.price = req.body.price;
  product.images[0] = req.file.path;
  await product.save();
  res.redirect("/seller");
  // res.send("added sucessfully");
};
module.exports = {
  productGet,
  addcartmoreGet,
  minusGet,
  addcartGet,
  deletecartGet,
  productUpdatePost,
  addProductPost,
  productDeletePost,
};
