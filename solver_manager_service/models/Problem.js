const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // Import the mongoose-sequence plugin for auto-increment

// Define the schema for a problem
const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // The name of the problem is required
  },
  createdOn: {
    type: Date,
    default: Date.now, // Default value is the current date and time
  },
  state: {
    type: String,
    enum: ["pending", "solved", "failed"], // State can only be one of these values
    default: "pending", // Default state is "pending"
  },
  username: {
    type: String,
    required: true, // The username associated with the problem is required
  },
  submissionId: {
    type: Number,
    unique: true, // Each submissionId must be unique
  },
});

// Add the AutoIncrement plugin to the schema
// This will automatically increment the "submissionId" field for each new document
problemSchema.plugin(AutoIncrement, { inc_field: "submissionId" });

// Create a model from the schema
const Problem = mongoose.model("Problem", problemSchema);

// Export the model to use it in other parts of the application
module.exports = Problem;
