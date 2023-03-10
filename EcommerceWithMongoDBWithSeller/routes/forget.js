const express = require("express");
const router = express.Router();
const { forgetUserGet, forgetUserPost } = require("../controllers/forget");

router.route("/").get(forgetUserGet);
router.route("/").post(forgetUserPost);
module.exports = router;
