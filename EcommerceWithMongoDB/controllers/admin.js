const ProductModal = require("../database/product");

const addProductGet = async (req, res) => {
  let products = await ProductModal.find({});
 
  res.render("admin.ejs", {
    products: products,
    name: req.session.user.name,
    isAdmin: req.session.user.isAdmin,
  });
};

module.exports = addProductGet;
