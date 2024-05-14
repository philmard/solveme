const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  submissionId: {
    type: Number,
    unique: true,
    required: true,
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
  inputData: {
    type: Object,
    required: true,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
