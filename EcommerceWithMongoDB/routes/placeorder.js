const express = require("express");
const router = express.Router();
const {
  placeOrderGet,
  placedOrderPost,
  placedOrderGet,
} = require("../controllers/placeorder");
const isAuth = require("../middleware/isAuth");
router.route("/").get(isAuth, placeOrderGet);
router.route("/:total").post(isAuth, placedOrderPost);
router.route("/myorders").get(isAuth, placedOrderGet);

module.exports = router;
