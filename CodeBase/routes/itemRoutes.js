// routes for item CRUD operations and search
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const requireAuth = require("../middleware/auth");

router.get("/", requireAuth, itemController.getItems);
router.get("/search", requireAuth, itemController.searchItems);
router.post("/", requireAuth, itemController.addItem);
router.put("/:id", requireAuth, itemController.updateItem);
router.delete("/:id", requireAuth, itemController.deleteItem);

module.exports = router;
