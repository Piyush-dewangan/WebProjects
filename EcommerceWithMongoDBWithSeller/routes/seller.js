const express = require("express");
const router = express.Router();
const { addProductGet, deliverProductGet } = require("../controllers/seller");
const isAuth = require("../middleware/isAuth");
const isSeller = require("../middleware/isSeller");
router.route("/").get(isAuth, isSeller, addProductGet);
router.route("/delivery").get(isAuth, isSeller, deliverProductGet);

module.exports = router;
