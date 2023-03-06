const express = require("express");
const router = express.Router();
const { loginUserGet, loginUserPost } = require("../controllers/login");

router.route("/").get(loginUserGet);
router.route("/").post(loginUserPost);
module.exports = router;
