const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlaceorderSchema = new Schema({
  id: {
    type: String,
  },
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  items: {
    type: Array,
  },
  total: {
    type: Number,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
const PlacorderModal = mongoose.model("placeorder", PlaceorderSchema);
module.exports = PlacorderModal;
