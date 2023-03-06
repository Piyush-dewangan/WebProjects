const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlaceorderSchema = new Schema({
  username: {
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
});
const PlacorderModal = mongoose.model("placeorder", PlaceorderSchema);
module.exports = PlacorderModal;
