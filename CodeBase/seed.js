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

  // create food bank users (password: demo123)
  const hashed = await bcrypt.hash("demo123", 10);

  const regina = await User.create({
    name: "Sarah Johnson",
    email: "regina@pantrihub.com",
    password: hashed,
    organization: "Regina Food Bank",
    address: "445 Winnipeg Street, Regina, SK S4R 8P2",
    phone: "306-791-6533",
    description: "Serving the Regina community since 1982. We provide food to over 25,000 people each month.",
  });

  const mooseJaw = await User.create({
    name: "Lisa Chen",
    email: "moosejaw@pantrihub.com",
    password: hashed,
    organization: "Moose Jaw Food Bank",
    address: "65 Ominica Street West, Moose Jaw, SK S6H 1X4",
    phone: "306-692-2911",
    description: "Providing essential food support to families and individuals in the Moose Jaw community.",
  });

  const saskatoon = await User.create({
    name: "Mike Thompson",
    email: "saskatoon@pantrihub.com",
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

  // items for Moose Jaw Food Bank
  const mooseJawItems = [
    { name: "Skim Milk", quantity: 10, unit: "cartons", category: "Dairy", expiry: daysFromNow(3), status: "Available" },
    { name: "Rye Bread", quantity: 12, unit: "loaves", category: "Bakery", expiry: daysFromNow(2), status: "Available" },
    { name: "Canned Corn", quantity: 55, unit: "cans", category: "Canned Goods", expiry: daysFromNow(350), status: "Surplus" },
    { name: "Potatoes", quantity: 25, unit: "lbs", category: "Produce", expiry: daysFromNow(14), status: "Available" },
    { name: "Penne Pasta", quantity: 40, unit: "boxes", category: "Pasta", expiry: daysFromNow(220), status: "Surplus" },
    { name: "Chicken Thighs", quantity: 10, unit: "lbs", category: "Meat", expiry: daysFromNow(2), status: "Available" },
    { name: "Canned Soup", quantity: 35, unit: "cans", category: "Canned Goods", expiry: daysFromNow(300), status: "Surplus" },
    { name: "Butter", quantity: 6, unit: "lbs", category: "Dairy", expiry: daysFromNow(5), status: "Low Stock" },
    { name: "Oatmeal", quantity: 15, unit: "boxes", category: "Grains", expiry: daysFromNow(120), status: "Available" },
    { name: "Apple Juice", quantity: 18, unit: "cartons", category: "Beverages", expiry: daysFromNow(30), status: "Available" },
  ];

  // items for Saskatoon Food Bank
  const saskatoonItems = [
    { name: "2% Milk", quantity: 20, unit: "cartons", category: "Dairy", expiry: daysFromNow(4), status: "Surplus" },
    { name: "Whole Wheat Bread", quantity: 15, unit: "loaves", category: "Bakery", expiry: daysFromNow(2), status: "Available" },
    { name: "Canned Tomatoes", quantity: 45, unit: "cans", category: "Canned Goods", expiry: daysFromNow(400), status: "Surplus" },
    { name: "Carrots", quantity: 8, unit: "lbs", category: "Produce", expiry: daysFromNow(5), status: "Low Stock" },
    { name: "Macaroni", quantity: 50, unit: "boxes", category: "Pasta", expiry: daysFromNow(250), status: "Surplus" },
    { name: "Greek Yogurt", quantity: 22, unit: "cups", category: "Dairy", expiry: daysFromNow(6), status: "Available" },
    { name: "Brown Rice", quantity: 30, unit: "bags", category: "Grains", expiry: daysFromNow(150), status: "Surplus" },
    { name: "Frozen Berries", quantity: 14, unit: "bags", category: "Frozen", expiry: daysFromNow(60), status: "Available" },
  ];

  // insert all items into the database
  for (const item of reginaItems) {
    await Item.create({ ...item, organization: "Regina Food Bank", createdBy: regina._id });
  }
  for (const item of mooseJawItems) {
    await Item.create({ ...item, organization: "Moose Jaw Food Bank", createdBy: mooseJaw._id });
  }
  for (const item of saskatoonItems) {
    await Item.create({ ...item, organization: "Saskatoon Food Bank", createdBy: saskatoon._id });
  }

  const totalItems = reginaItems.length + mooseJawItems.length + saskatoonItems.length;
  console.log(`Seeded ${totalItems} inventory items`);
  console.log("\n--- Demo Logins (password: demo123) ---");
  console.log("Regina:    regina@pantrihub.com");
  console.log("Moose Jaw: moosejaw@pantrihub.com");
  console.log("Saskatoon: saskatoon@pantrihub.com");
  console.log("---------------------------------------\n");

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
