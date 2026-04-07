const Item = require("../models/Item");
const User = require("../models/User");

// returns dashboard stats for the logged in user's organization
exports.getDashboard = async (req, res) => {
  try {
    // all items across every organization for the shared dashboard
    const allItems = await Item.find({});
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const totalItems = allItems.length;
    const totalQuantity = allItems.reduce((sum, i) => sum + i.quantity, 0);

    // filter items by their expiry/status
    const expiringSoon = allItems.filter((i) => i.expiry <= oneWeek && i.expiry >= now);
    const surplus = allItems.filter((i) => i.status === "Surplus");
    const expired = allItems.filter((i) => i.expiry < now);

    // count items per category
    const categories = {};
    allItems.forEach((i) => {
      categories[i.category] = (categories[i.category] || 0) + i.quantity;
    });

    res.json({
      totalItems,
      totalQuantity,
      expiringSoonCount: expiringSoon.length,
      surplusCount: surplus.length,
      expiredCount: expired.length,
      expiringSoon: expiringSoon.slice(0, 6),
      surplus: surplus.slice(0, 6),
      categories,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};
