// appHub.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve HTML, CSS, JS

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/pantriHub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// User schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// Routes

// Load login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signinHub.html"));
});

// Load register page
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signupHub.html"));
});

// Register user
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.send("Email already registered");

        const newUser = new User({ email, password });
        await newUser.save();

        res.send("Registration successful");

    } catch (err) {
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
            res.redirect("/myinventory.html"); // replace with your actual page
        } else {
            res.send("Invalid password");
        }

    } catch (err) {
        console.log(err);
        res.send("Error logging in: " + err.message);
    }
});

// Logout (redirect to login)
app.get("/logout", (req, res) => {
    res.redirect("/");
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
