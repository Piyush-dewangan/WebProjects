const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema({
  username: {
    type: String,
  },
  cartitems: {
    type: Array,
  },
});
const CartModal = mongoose.model("cart", CartSchema);
module.exports = CartModal;
