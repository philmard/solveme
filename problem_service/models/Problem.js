const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: String,
    enum: ["notReady", "ready", "executed", "failed"],
    default: "notReady",
  },
  userId: {
    type: Number,
    required: true,
  },
  submissionId: {
    type: Number,
    unique: true,
    required: true,
  },
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
