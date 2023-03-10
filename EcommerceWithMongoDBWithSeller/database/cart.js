const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  cartitems: [],
  username: {
    type: String,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
const CartModal = mongoose.model("cart", CartSchema);
module.exports = CartModal;
