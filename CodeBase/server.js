const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/pantriHub";

// --------------- Middleware ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "pantriHub-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);
app.use(express.static(path.join(__dirname, "public")));

// --------------- MongoDB ---------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// --------------- Schemas ---------------
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
const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  expiry: { type: Date, required: true },
  status: { type: String, default: "Available" },
  organization: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Item = mongoose.model("Item", itemSchema);

// --------------- Auth Middleware ---------------
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// --------------- Auth Routes ---------------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      organization: organization || "",
    });
    req.session.userId = user._id;
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    req.session.userId = user._id;
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// --------------- Account Routes ---------------
app.put("/api/account", requireAuth, async (req, res) => {
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
});

// --------------- Item CRUD Routes ---------------
// List items for current user's organization
app.get("/api/items", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const query = user.organization
      ? { organization: user.organization }
      : { createdBy: user._id };
    const items = await Item.find(query).sort({ expiry: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Search items across all organizations
app.get("/api/items/search", requireAuth, async (req, res) => {
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
});

// Add item
app.post("/api/items", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const item = await Item.create({
      ...req.body,
      organization: user.organization || "",
      createdBy: user._id,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Update item
app.put("/api/items/:id", requireAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Delete item
app.delete("/api/items/:id", requireAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// --------------- Dashboard Stats ---------------
app.get("/api/dashboard", requireAuth, async (req, res) => {
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
    const expiringSoon = items.filter((i) => i.expiry <= oneWeek && i.expiry >= now);
    const surplus = items.filter((i) => i.status === "Surplus");
    const expired = items.filter((i) => i.expiry < now);

    // Category breakdown
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
});

// --------------- Page Routes ---------------
// Protected pages - check auth and redirect to login if needed
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/home.html");
  }
  res.sendFile(path.join(__dirname, "public", "signin.html"));
});

// --------------- Start Server ---------------
app.listen(PORT, () => {
  console.log(`PantriHub running at http://localhost:${PORT}`);
});
