const fs = require("fs");
const cartdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/cart.txt";

const productdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/product.txt";

const productGet = (req, res) => {
  const { id } = req.params;
  fs.readFile(productdir, "utf-8", (err, data) => {
    let products = JSON.parse(data);

    products.forEach((product) => {
      if (product.id == id) {
        console.log(id);
        res.render("item.ejs", { product: product, name: req.session.name });
        return;
      }
    });
  });
};
const addcartGet = (req, res) => {
  const { id } = req.params;
  fs.readFile(cartdir, "utf-8", (err, data) => {
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
    fs.writeFile(cartdir, JSON.stringify(cart), (err) => {
      res.redirect("/cart");
    });
  });
};
const minusGet = (req, res) => {
  const { id } = req.params;
  fs.readFile(cartdir, "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;
    if (cart[username]) {
      cart[username][id].quantity--;
    }
    fs.writeFile(cartdir, JSON.stringify(cart), (err) => {
      res.redirect("/cart");
    });
  });
};
const deletecartGet = (req, res) => {
  const { id } = req.params;
  fs.readFile(cartdir, "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;
    if (cart[username]) {
      if (cart[username][id]) {
        delete cart[username][id];
      }
    }
    fs.writeFile(cartdir, JSON.stringify(cart), (err) => {
      res.redirect("/cart");
    });
  });
};
module.exports = { productGet, addcartGet, minusGet, deletecartGet };
