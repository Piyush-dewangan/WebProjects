const express = require("express");
const router = express.Router();
const placeOrderGet = require("../controllers/placeorder");
const isAuth = require("../middleware/isAuth");
router.route("/").get(isAuth, placeOrderGet);

module.exports = router;
