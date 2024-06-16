require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Result = require("./models/Result");
var amqp = require("amqplib/callback_api");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
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
  console.log(`Result Service running on port ${port}`);
});

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

              await new Result({
                username,
                submissionId,
                name,
                results,
              }).save();
              await axios.put(`http://solver_manager_service:3000/problems`, {
                username,
                submissionId,
                state: "solved",
              });
            } catch (error) {
              const { metadata } = JSON.parse(content.toString());
              const { username, submissionId } = metadata;
              await axios.put(`http://solver_manager_service:3000/problems`, {
                username,
                submissionId,
                state: "failed",
              });
              console.log(error);
            }
          },
          {
            noAck: true,
          },
        );
      },
    );
  });
});

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
