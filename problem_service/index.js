require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Problem = require("./models/Problem");
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
    var msg = "Hello world";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});

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
  console.log(`Problem Service running on port ${port}`);
});

app.get("/problems/:userId", async (req, res) => {
  try {
    const problem = await Problem.findOne({ userId: req.params.userId });
    if (!problem) return res.status(404).send("Problem not found");
    res.send(problem);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.put("/problems/:userId", async (req, res) => {
  const { userId, state } = req.body;
  try {
    let problem = await Problem.findOneAndUpdate(
      {
        userId,
      },
      {
        state,
      },
      {
        new: true,
        upsert: false,
      },
    );
    await problem.save();
    res.send(problem);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Add or update credits
app.post("/problems", async (req, res) => {
  const { userId, submissionId, name } = req.body;
  try {
    let problem = new Problem({ userId, submissionId, name });
    await problem.save();
    res.send(problem);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.delete("/problems/:userId", async (req, res) => {
  const { userId, submissionId } = req.body;
  try {
    let problem = await Problem.findOneAndDelete({
      userId,
      submissionId,
    });
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
