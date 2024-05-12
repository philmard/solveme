require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Submission = require("./models/Submission");

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
  console.log(`Submission Service running on port ${port}`);
});

app.get("/submission/:submissionId", async (req, res) => {
  try {
    const submission = await Submission.findOne({ submissionId: req.params.submissionId });
    if (!submission) return res.status(404).send("Submission not found");
    res.send(submission);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.put("/submission/:submissionId", async (req, res) => {
  const {submissionId} = req.params;
  const { userId, solverId } = req.body;
  try {
    let submission = await Submission.findOneAndUpdate(
        {
          submissionId,
        },
      {
        userId,
      },
      {
        solverId,
      },
      {
        new: true,
        upsert: false,
      },
    );
    await submission.save();
    res.send(submission);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Add or update credits
app.post("/Submission", async (req, res) => {
  const { userId, submissionId, solverId, name } = req.body;
  try {
    let submission = new Submission({ userId, submissionId, solverId, name });
    await submission.save();
    res.send(submission);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.delete("/submission/:submissionId", async (req, res) => {
  const { userId, submissionId } = req.body;
  try {
    let submission = await Submission.findOneAndDelete({
      userId,
      submissionId,
    });
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
