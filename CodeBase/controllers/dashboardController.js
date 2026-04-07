const Item = require("../models/Item");
const User = require("../models/User");

// returns dashboard stats for the logged in user's organization
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const query = user.organization
      ? { organization: user.organization }
      : { createdBy: user._id };

    const items = await Item.find(query);
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    // filter items by their expiry/status
    const expiringSoon = items.filter((i) => i.expiry <= oneWeek && i.expiry >= now);
    const surplus = items.filter((i) => i.status === "Surplus");
    const expired = items.filter((i) => i.expiry < now);

    // count items per category
    const categories = {};
    items.forEach((i) => {
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
