const fs = require("fs");
const cartdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/cart.txt";

const productdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/product.txt";

const ProductModal = require("../database/product");
const CartModal = require("../database/cart");

const cartGet = async (req, res) => {
  let { username } = req.session.user;
  let cart = await CartModal.findOne({ username: username });
  console.log(cart);
  if (cart != null) {
    let products = await ProductModal.find({});

    res.render("mycart.ejs", {
      products: products,
      cart: cart.cartitems,
      name: req.session.name,
      isSeller: req.session.user.isSeller,
    });
  } else {
    let products = [];
    res.render("mycart.ejs", {
      products: products,
      cart: [],
      name: req.session.name,
      isSeller: req.session.user.isSeller,
    });
  }
};

module.exports = { cartGet };
