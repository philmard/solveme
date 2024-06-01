require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Result = require("./models/Result");
var amqp = require("amqplib/callback_api");

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
  console.log(`Result Service running on port ${port}`);
});

// submissionId instead of userId here ??
app.get("/results/:submissionId", async (req, res) => {
  try {
    const result = await Result.findOne({
      submissionId: req.params.submissionId,
    });
    if (!result) return res.status(404).send("Result not found");
    res.send(result);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// "POST /create"

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
          function (msg) {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            );
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});

//             const { userId, submissionId, name, solverId, } = JSON.parse(msg.content.toString)['metadata'];
//             const result = {"result":JSON.parse(msg.content.toString)['result']};

app.post("/results", async (req, res) => {
  const { userId, submissionId, name, solverId, result } = req.body;
  try {
    let result1 = new Result({ userId, submissionId, name, solverId, result });
    await result1.save();
    res.send(result1);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// submissionId instead of userId here ??
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
