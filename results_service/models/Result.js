const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  executedOn: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Number,
    required: true,
  },
  solverId: {
    type: String,
    required: true,
  },
  submissionId: {
    type: Number,
    required: true,
  },
  result: {
    type: Object,
    required: true,
  },
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
