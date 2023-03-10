const express = require("express");
const router = express.Router();
const { signupUserGet, signupUserPost } = require("../controllers/signup");

router.route("/").get(signupUserGet);
router.route("/").post(signupUserPost);
module.exports = router;
