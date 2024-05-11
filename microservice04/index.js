require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Result = require("./models/Result");

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
    console.log(`Result Service running on port ${port}`);
});

// submissionId instead of userId here ??
app.get("/results/:submissionId", async (req, res) => {
    try {
        const result = await Result.findOne({submissionId: req.params.submissionId});
        if (!result) return res.status(404).send("Result not found");
        res.send(result);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// "POST /create"
app.post("/results", async (req, res) => {
    const {userId, submissionId, name, resultId, solverId} = req.body;
    try {
        let result = new Result({userId, submissionId, name, resultId, solverId});
        await result.save();
        res.send(result);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


// submissionId instead of userId here ??
app.delete("/results/:submissionId", async (req, res) => {
    const {userId, submissionId} = req.body;
    try {
        let result = await Result.findOneAndDelete({
            userId,
            submissionId,
        });
        res.status(200).json({message: "Result deleted successfully"});
    } catch (error) {
        res.status(500).send(error.toString());
    }
});
