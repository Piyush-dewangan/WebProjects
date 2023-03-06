const CartModal = require("../database/cart");
const ProductModal = require("../database/product");
const placeOrderGet = async (req, res) => {
  let cart = await CartModal.findOne({ username: req.session.user.username });
  let product = await ProductModal.find({});
  console.log(cart);
  res.render("placeorder.ejs", {
    name: req.session.user.name,
    isAdmin: req.session.user.isAdmin,
    cart: cart.cartitems,
    product: product,
  });
};

module.exports = placeOrderGet;
