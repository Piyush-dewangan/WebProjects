const express = require("express");
const router = express.Router();
const addProductGet = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
router.route("/").get(isAuth, isAdmin, addProductGet);

module.exports = router;
