const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

// importing route files
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const itemRoutes = require("./routes/itemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/pantriHub";

// middleware setup
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

// serving static files from public folder (views)
app.use(express.static(path.join(__dirname, "public")));

// connecting to mongodb
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/dashboard", dashboardRoutes);

// redirect to home if logged in, otherwise show signin page
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/home.html");
  }
  res.sendFile(path.join(__dirname, "public", "signin.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`PantriHub running at http://localhost:${PORT}`);
});
