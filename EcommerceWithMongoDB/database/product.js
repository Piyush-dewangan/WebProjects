const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  currency: {
    type: String,
    default: "USD",
  },
  brand: {
    type: String,
    default: "Best Brand",
  },
  category: {
    type: String,
    default: "General",
  },
  colors: {
    type: Array,
    default: "black",
  },
  images: {
    type: Array,
  },
  quantity: {
    type: Number,
  },
});

const ProductModal = mongoose.model("product", ProductSchema);
module.exports = ProductModal;
