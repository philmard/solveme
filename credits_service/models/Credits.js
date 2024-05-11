const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Credit = mongoose.model("Credit", creditSchema);

module.exports = Credit;
