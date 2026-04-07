// appHub.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // serve HTML, CSS

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/pantriHub')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

//schema for user auth, flesh this out as html is dev to account for more user info
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

//schema for items. Based on activity 2 doc
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
    category: String,
    expiry: Date,
    status: String
});
const Item = mongoose.model("Item", itemSchema);

//Site routes

// Load login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signin.html"));
});

// Load register page
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Register user
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.send("Email already registered");
        const newUser = new User({ email, password });
        await newUser.save();
        res.send("Registration successful");
    } 
    catch (err) {//put in error handling for duplicate email and other potential issues
        console.log(err);
        res.send("Error registering user: " + err.message);
    }
});

// Login user
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.send("User not found");
            if (user.password === password) {
                res.redirect("/myinventory.html"); // change as needed
            } 
            else {
                res.send("Invalid password");
            }
    } 
    catch (err) {
        console.log(err);
        res.send("Error logging in: " + err.message);
    }
});

// Logout
app.get("/logout", (req, res) => {
    res.redirect("/");
});

//Routes / CRUD

// Add item get (page)
app.get("/add-item", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "addItem.html"));
});

//Add item psot
app.post("/add-item", async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.send("Item added successfully! <a href='/items'>View Items</a>");
    } catch (err) {
        console.error(err);
        res.send("Error adding item");
    }
});

// Read (R) - list all items from db
app.get("/items", async (req, res) => {
    try {
        const items = await Item.find({});
        let html = "<h1>Items</h1><table border='1'><tr><th>Name</th><th>Quantity</th><th>Unit</th><th>Category</th><th>Expiry</th><th>Status</th></tr>";//chart for now
        items.forEach(item => {
            html += `<tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${item.category}</td>
                <td>${item.expiry.toISOString().split('T')[0]}</td>
                <td>${item.status}</td>
            </tr>`;
        });//had to look up ISOString.split
        html += "</table><a href='/add-item'>Add New Item</a>";
        res.send(html);
    } 
    catch (err) {
        console.error(err);
        res.send("Error fetching items");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
