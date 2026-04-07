const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Item = require("./models/Item");

const MONGO_URI = "mongodb://127.0.0.1:27017/pantriHub";

// helper to get a date X days from now
function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // clear existing data
  await User.deleteMany({});
  await Item.deleteMany({});
  console.log("Cleared existing data");

  // create demo user (password: demo123)
  const hashed = await bcrypt.hash("demo123", 10);
  const user = await User.create({
    name: "Sarah Johnson",
    email: "demo@pantrihub.com",
    password: hashed,
    organization: "Regina Food Bank",
    address: "445 Winnipeg Street, Regina, SK S4R 8P2",
    phone: "306-791-6533",
    description: "Serving the Regina community since 1982. We provide food to over 25,000 people each month.",
  });
  console.log("Created demo user: demo@pantrihub.com / demo123");

  // create a second food bank user
  const user2 = await User.create({
    name: "Mike Thompson",
    email: "mike@saskatoonfoodbank.ca",
    password: hashed,
    organization: "Saskatoon Food Bank",
    address: "202 Avenue C South, Saskatoon, SK S7M 1N2",
    phone: "306-664-6565",
    description: "Supporting families in Saskatoon with nutritious food and community programs.",
  });

  // items for Regina Food Bank
  const reginaItems = [
    { name: "Whole Milk", quantity: 12, unit: "cartons", category: "Dairy", expiry: daysFromNow(2), status: "Available" },
    { name: "White Bread", quantity: 25, unit: "loaves", category: "Bakery", expiry: daysFromNow(1), status: "Available" },
    { name: "Apples", quantity: 10, unit: "lbs", category: "Produce", expiry: daysFromNow(3), status: "Available" },
    { name: "Basmati Rice", quantity: 40, unit: "bags", category: "Grains", expiry: daysFromNow(180), status: "Surplus" },
    { name: "Canned Beans", quantity: 60, unit: "cans", category: "Canned Goods", expiry: daysFromNow(365), status: "Surplus" },
    { name: "Spaghetti", quantity: 35, unit: "packs", category: "Pasta", expiry: daysFromNow(200), status: "Surplus" },
    { name: "Yogurt Cups", quantity: 18, unit: "cups", category: "Dairy", expiry: daysFromNow(5), status: "Available" },
    { name: "Cheddar Cheese", quantity: 8, unit: "lbs", category: "Dairy", expiry: daysFromNow(6), status: "Low Stock" },
    { name: "Ground Beef", quantity: 15, unit: "lbs", category: "Meat", expiry: daysFromNow(3), status: "Available" },
    { name: "Frozen Peas", quantity: 20, unit: "bags", category: "Frozen", expiry: daysFromNow(90), status: "Available" },
    { name: "Orange Juice", quantity: 24, unit: "cartons", category: "Beverages", expiry: daysFromNow(10), status: "Available" },
    { name: "Peanut Butter", quantity: 30, unit: "units", category: "Other", expiry: daysFromNow(300), status: "Surplus" },
    { name: "Eggs", quantity: 5, unit: "cartons", category: "Dairy", expiry: daysFromNow(4), status: "Low Stock" },
    { name: "Bananas", quantity: 30, unit: "lbs", category: "Produce", expiry: daysFromNow(2), status: "Available" },
    { name: "Chicken Breast", quantity: 12, unit: "lbs", category: "Meat", expiry: daysFromNow(2), status: "Available" },
  ];

  // items for Saskatoon Food Bank
  const saskatoonItems = [
    { name: "2% Milk", quantity: 20, unit: "cartons", category: "Dairy", expiry: daysFromNow(4), status: "Surplus" },
    { name: "Whole Wheat Bread", quantity: 15, unit: "loaves", category: "Bakery", expiry: daysFromNow(2), status: "Available" },
    { name: "Canned Tomatoes", quantity: 45, unit: "cans", category: "Canned Goods", expiry: daysFromNow(400), status: "Surplus" },
    { name: "Carrots", quantity: 8, unit: "lbs", category: "Produce", expiry: daysFromNow(5), status: "Low Stock" },
    { name: "Macaroni", quantity: 50, unit: "boxes", category: "Pasta", expiry: daysFromNow(250), status: "Surplus" },
  ];

  // insert all items into the database
  for (const item of reginaItems) {
    await Item.create({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      expiry: item.expiry,
      status: item.status,
      organization: "Regina Food Bank",
      createdBy: user._id,
    });
  }
  for (const item of saskatoonItems) {
    await Item.create({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      expiry: item.expiry,
      status: item.status,
      organization: "Saskatoon Food Bank",
      createdBy: user2._id,
    });
  }

  console.log(`Seeded ${reginaItems.length + saskatoonItems.length} inventory items`);
  console.log("\n--- Demo Login ---");
  console.log("Email: demo@pantrihub.com");
  console.log("Password: demo123");
  console.log("------------------\n");

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
