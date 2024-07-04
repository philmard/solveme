const mongoose = require("mongoose");

// Define the schema for a User
const userSchema = new mongoose.Schema({
    // Username field - must be unique and is required
    username: {
        type: String,
        unique: true,
        required: true,
    },
    // Password field - required
    password: {
        type: String,
        required: true,
    },
    // Credits field - default value is 0 and is required
    credits: {
        type: Number,
        default: 0,
        required: true,
    }
});

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model to be used in other parts of the application
module.exports = User;
