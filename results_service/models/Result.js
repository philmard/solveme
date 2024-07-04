const mongoose = require("mongoose");

// Define the schema for the result documents
const resultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // The name of the problem, required field
  },
  executedOn: {
    type: Date,
    default: Date.now, // The date and time when the result was executed, defaulting to the current date and time
  },
  username: {
    type: String,
    required: true, // The username of the person who submitted the problem, required field
  },
  submissionId: {
    type: Number,
    required: true, // The unique ID of the problem submission, required field
  },
  results: {
    type: Object,
    required: true, // The result of the problem execution, stored as an object, required field
  },
});

// Create a Mongoose model using the schema
const Result = mongoose.model("Result", resultSchema);

// Export the model to be used in other parts of the application
module.exports = Result;
