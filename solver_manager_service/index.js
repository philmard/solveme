require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const amqp = require("amqplib/callback_api");
const fs = require("fs");
const path = require("path");
const base64 = require("base-64");
const os = require("os");
const mongoose = require("mongoose");
const Problem = require("./models/Problem");
const app = express();
const cors = require("cors");

// Middleware setup
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// GET route to retrieve problems for a specific user
app.get("/problems/:username", async (req, res) => {
  try {
    const problems = await Problem.find({ username: req.params.username });
    if (!problems.length) return res.status(204).send("No problems found");
    res.send(problems);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// PUT route to update the state of a problem
app.put("/problems", async (req, res) => {
  const { username, state, submissionId } = req.body;
  try {
    let problem = await Problem.findOneAndUpdate(
        {
          username,
          submissionId,
        },
        {
          state,
        },
        {
          new: true,
          upsert: false,
        }
    );
    res.send(problem);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// POST route to submit a problem for solving
app.post("/solve", async (req, res) => {
  const pyFile = req.files ? req.files.py_file : null;
  const jsonFile = req.files ? req.files.json_file : null;
  const numVehicles = req.body.num_vehicles;
  const depot = req.body.depot;
  const maxDistance = req.body.max_distance;

  const metadata = JSON.parse(req.body.metadata || "{}");
  const { username, name } = metadata;

  let problem = new Problem({ username, name });
  const submissionId = await problem.save().then((doc) => doc.submissionId);

  // Validate the input
  if (!pyFile || !pyFile.name.endsWith(".py") || !numVehicles || !depot || !maxDistance) {
    await Problem.findOneAndUpdate(
        { username, submissionId },
        { state: "failed" },
        { new: true, upsert: false }
    );
  }

  if (!pyFile) {
    return res.status(400).json({ error: "No Python script part in the request" });
  }

  if (!pyFile.name.endsWith(".py")) {
    return res.status(400).json({ error: "Invalid file type. Only .py files are allowed." });
  }

  if (!numVehicles || !depot || !maxDistance) {
    return res.status(400).json({ error: "Three numerical arguments are required" });
  }

  let args;
  try {
    args = [parseInt(numVehicles), parseInt(depot), parseInt(maxDistance)];
  } catch (err) {
    return res.status(400).json({ error: "All arguments must be integers" });
  }

  let jsonContent = null;
  if (jsonFile) {
    if (!jsonFile.name.endsWith(".json")) {
      return res.status(400).json({ error: "Invalid file type. Only .json files are allowed." });
    }
    jsonContent = jsonFile.data.toString("utf8");
  }

  try {
    // Save the Python file as a temporary file
    const pyTempPath = path.join(os.tmpdir(), pyFile.name);
    fs.writeFileSync(pyTempPath, pyFile.data);
    const pyBase64 = base64.encode(fs.readFileSync(pyTempPath, "utf8"));

    // Save the JSON file as a temporary file (if exists)
    let jsonBase64 = null;
    if (jsonContent) {
      const jsonTempPath = path.join(os.tmpdir(), jsonFile.name);
      fs.writeFileSync(jsonTempPath, jsonContent);
      jsonBase64 = base64.encode(fs.readFileSync(jsonTempPath, "utf8"));
    }

    // Prepare the task message
    const task = {
      py_file: pyBase64,
      json_file: jsonBase64,
      num_vehicles: numVehicles,
      depot: depot,
      max_distance: maxDistance,
      metadata: { ...metadata, submissionId },
    };

    // Connect to RabbitMQ and publish the task
    amqp.connect("amqp://rabbitmq", (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        const exchange = "solver";
        const key = "solve";
        const message = JSON.stringify(task);
        console.log(message);

        channel.assertExchange(exchange, "direct", { durable: false });
        channel.publish(exchange, key, Buffer.from(message), { length: 500, "x-max-length": 500 });

        setTimeout(() => {
          connection.close();
        }, 500);
      });
    });

    // Clean up temporary files
    fs.unlinkSync(pyTempPath);
    if (jsonContent) {
      const jsonTempPath = path.join(os.tmpdir(), jsonFile.name);
      fs.unlinkSync(jsonTempPath);
    }

    res.json({ output: "added to queue", error: null });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
