require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Result = require("./models/Result"); // Import the Result model
const amqp = require("amqplib/callback_api"); // Import the amqplib for RabbitMQ
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all origins

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
  console.log(`Result Service running on port ${port}`);
});

// RabbitMQ connection setup
amqp.connect("amqp://rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = "result";
    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(" [*] Waiting for logs. To exit press CTRL+C");

          channel.bindQueue(q.queue, exchange, "solve");

          channel.consume(
              q.queue,
              async ({ content }) => {
                try {
                  const { metadata, results } = JSON.parse(content.toString());
                  const { username, submissionId, name } = metadata;

                  // Save the result to the database
                  await new Result({
                    username,
                    submissionId,
                    name,
                    results,
                  }).save();

                  // Update the problem state to "solved"
                  await axios.put(`http://solver_manager_service:3000/problems`, {
                    username,
                    submissionId,
                    state: "solved",
                  });
                } catch (error) {
                  const { metadata } = JSON.parse(content.toString());
                  const { username, submissionId } = metadata;

                  // Update the problem state to "failed" in case of an error
                  await axios.put(`http://solver_manager_service:3000/problems`, {
                    username,
                    submissionId,
                    state: "failed",
                  });
                  console.log(error);
                }
              },
              {
                noAck: true, // Acknowledge messages automatically
              },
          );
        },
    );
  });
});

// Endpoint to get a result by submissionId
app.get("/results/:submissionId", async (req, res) => {
  try {
    const result = await Result.findOne({
      submissionId: parseInt(req.params.submissionId),
    });
    if (!result) return res.status(404).send("Result not found");
    res.send(result);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to create a new result
app.post("/results", async (req, res) => {
  const { username, submissionId, name, solverId, result } = req.body;
  try {
    let result1 = new Result({
      username,
      submissionId,
      name,
      solverId,
      result,
    });
    await result1.save();
    res.send(result1);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to delete a result by submissionId
app.delete("/results/:submissionId", async (req, res) => {
  const { submissionId } = req.body;
  try {
    let result = await Result.findOneAndDelete({
      submissionId,
    });
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
