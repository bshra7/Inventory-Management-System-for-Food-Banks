// route for updating user account info
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const requireAuth = require("../middleware/auth");

router.put("/", requireAuth, accountController.updateAccount);

module.exports = router;
