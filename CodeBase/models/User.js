const mongoose = require("mongoose");

// user schema for storing food bank user accounts
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
