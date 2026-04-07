const User = require("../models/User");

// updates the logged in user's account details
exports.updateAccount = async (req, res) => {
  try {
    const { name, organization, address, phone, description } = req.body;

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { name, organization, address, phone, description },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update account" });
  }
};
