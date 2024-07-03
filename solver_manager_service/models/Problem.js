const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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
    enum: ["pending", "solved", "failed"],
    default: "pending",
  },
  username: {
    type: String,
    required: true,
  },
  submissionId: {
    type: Number,
    unique: true,
  },
});

// Add the AutoIncrement plugin to your schema
problemSchema.plugin(AutoIncrement, { inc_field: "submissionId" });

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
