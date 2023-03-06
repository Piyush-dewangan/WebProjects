const express = require("express");
const router = express.Router();
const resetGet = require("../controllers/resetPass");

router.route("/:token").get(resetGet);

module.exports = router;
