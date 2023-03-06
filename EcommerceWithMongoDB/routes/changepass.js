const express = require("express");
const router = express.Router();
const { changePassGet, changePassPost } = require("../controllers/changepass");
const isAuth = require("../middleware/isAuth");
router.route("/").get(isAuth, changePassGet);
router.route("/changed").post(isAuth, changePassPost);
module.exports = router;
