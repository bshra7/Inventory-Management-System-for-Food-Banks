const Item = require("../models/Item");
const User = require("../models/User");

// get all items for the current user's organization
exports.getItems = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    // if user has an org, show all org items, otherwise just their own
    const query = user.organization
      ? { organization: user.organization }
      : { createdBy: user._id };

    const items = await Item.find(query).sort({ expiry: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// search items across all organizations
exports.searchItems = async (req, res) => {
  try {
    const { q, category, status } = req.query;
    const filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await Item.find(filter).sort({ expiry: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

// add a new item to inventory
exports.addItem = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    const item = await Item.create({
      name: req.body.name,
      quantity: req.body.quantity,
      unit: req.body.unit,
      category: req.body.category,
      expiry: req.body.expiry,
      status: req.body.status || "Available",
      organization: user.organization || "",
      createdBy: user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};

// update an existing item by id
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

// delete an item by id
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};
