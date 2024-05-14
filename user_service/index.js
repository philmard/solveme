require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Start the server
app.listen(port, () => {
    console.log(`Credit Service running on port ${port}`);
});


app.post("/users", async (req, res) => {
    const {userId, username, password} = req.body;
    try {
        let user = new User({username, password});
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get("/users/:username", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username});
        if (!user) return res.status(404).send("User not found");
        res.send(user);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.delete("/users/:username", async (req, res) => {
    try {
        const username = req.params.username;
        // Find the user by username
        const user = await User.findOne({username});
        // If user not found, return 404
        if (!user) return res.status(404).send("User not found");
        // Delete the user
        await User.deleteOne({username});
        res.send(`User ${username} deleted successfully`);
    } catch (error) {
        // Handle any errors
        res.status(500).send(error.toString());
    }
});
