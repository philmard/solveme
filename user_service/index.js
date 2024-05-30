require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import the cors module
var amqp = require("amqplib/callback_api");

amqp.connect("amqp://rabbitmq", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = "hello";

        channel.assertQueue(queue, {
            durable: false,
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(
            queue,
            function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            },
            {
                noAck: true,
            },
        );
    });
});

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

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
    console.log(`User Service running on port ${port}`);
});

app.post("/users", async (req, res) => {
    const {username, password} = req.body;

    try {
        // Check if a user with the same username already exists
        const existingUser = await User.findOne({username});
        if (existingUser) { // username already exists
            return res.status(409).json({message: 'Username already exists.'});
        }

        // If not, create a new user
        let user = new User({username, password});
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: 'An error occurred while creating the user.'});
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

// add credits
app.put("/users/:username/add-credit", async (req, res) => {
    const {username} = req.params;
    const {credits} = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({username});

        // If user not found, return 404 Not Found
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Increment the credits by the specified number
        user.credits += credits;

        // Save the updated user
        await user.save();

        // Return the updated user with the incremented credits
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "An error occurred while adding credit"});
    }
});

// remove credits
app.put("/users/:username/remove-credit", async (req, res) => {
    const {username} = req.params;

    try {
        // Find the user by username
        const user = await User.findOne({username});

        // If user not found, return 404 Not Found
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // decrement the credits by 1
        user.credits -= 1;

        // Save the updated user
        await user.save();

        // Return the updated user with the decremented credits
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "An error occurred while decrementing credit"});
    }
});