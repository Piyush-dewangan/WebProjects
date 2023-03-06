const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();
const {
  productGet,
  addcartmoreGet,
  addcartGet,
  minusGet,
  deletecartGet,
  productUpdatePost,
  addProductPost,
  productDeletePost,
} = require("../controllers/product");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
router.route("/:id").get(isAuth, productGet);
router.route("/updatedetails/:id").post(isAuth, isAdmin, productUpdatePost);
router.route("/addproduct").post(upload.single("file"), addProductPost);
router.route("/delete/:id").get(isAuth, isAdmin, productDeletePost);
router.route("/addcart/:id").get(isAuth, addcartGet);
router.route("/addcart/add/:id").get(isAuth, addcartmoreGet);

router.route("/minuscart/:id").get(isAuth, minusGet);
router.route("/deletecart/:id").get(isAuth, deletecartGet);
module.exports = router;
