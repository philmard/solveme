const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
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
  },
  solverId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  metaData: {
    type: Object,
    required: true,
  },
});

const Problem = mongoose.model("Problem", submissionSchema);

module.exports = Problem;
