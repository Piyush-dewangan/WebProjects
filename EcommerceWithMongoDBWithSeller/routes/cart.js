const express = require("express");
const router = express.Router();
const { cartGet } = require("../controllers/cart");
const isAuth = require("../middleware/isAuth");
router.route("/").get(isAuth, cartGet);

module.exports = router;
