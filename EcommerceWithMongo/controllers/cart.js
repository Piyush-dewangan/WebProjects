const fs = require("fs");
const cartdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/cart.txt";

const productdir =
  "/home/yogesh/webprojects/CodeQuotient/web-projects-Html-Css-Js-/EcommerceWithMongo/product.txt";

const cartGet = (req, res) => {
  fs.readFile(cartdir, "utf-8", (err, data) => {
    let cart;
    cart = JSON.parse(data);
    let { username } = req.session.user;

    if (cart[username]) {
      let products;
      fs.readFile(productdir, "utf-8", (err, data) => {
        products = JSON.parse(data);

        res.render("mycart.ejs", {
          products: products,
          cart: cart[username],
          name: req.session.name,
        });
      });
    } else {
    }
  });
};

module.exports = { cartGet };
