const express = require("express");
const router = express.Router();
const {
  adminGet,
  adminHome,
  adminLoginPost,
  createSellerGet,
  createSellerPost,
  adminDeleteSellerGet,
  adminSeeAllProductGet,
  adminLogoutGet,
} = require("../controllers/admin");
const isAdmin = require("../middleware/isAdmin");
router.route("/").get(isAdmin, adminHome);
router.route("/logout").get(adminLogoutGet);
router.route("/login").get(adminGet);
router.route("/login").post(adminLoginPost);
router.route("/seeallproducts").get(isAdmin, adminSeeAllProductGet);
router.route("/deleteseller").get(isAdmin, adminDeleteSellerGet);
router.route("/createseller").get(isAdmin, createSellerGet);
router.route("/createseller").post(isAdmin, createSellerPost);

module.exports = router;
