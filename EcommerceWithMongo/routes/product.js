const express = require("express");
const router = express.Router();
const {
  productGet,
  addcartGet,
  minusGet,
  deletecartGet,
} = require("../controllers/product");
const isAuth = require("../middleware/isAuth");
router.route("/:id").get(isAuth, productGet);
router.route("/addcart/:id").get(isAuth, addcartGet);
router.route("/minuscart/:id").get(isAuth, minusGet);
router.route("/deletecart/:id").get(isAuth, deletecartGet);
module.exports = router;
