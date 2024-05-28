require("dotenv").config();
const express = require("express");
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
  const { username, password } = req.body;
  try {
    let user = new User({ username, password });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.post("/users", async (req, res) => {
  const { userId, username, password } = req.body;
  try {
    let user = new User({ username, password });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get("/users/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
