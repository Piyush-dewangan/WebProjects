const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  mailToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
});
const UserModal = mongoose.model("user", UserSchema);
module.exports = UserModal;
