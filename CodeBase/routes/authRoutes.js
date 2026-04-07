// auth routes for register, login, logout, and current user
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);
router.get("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;
