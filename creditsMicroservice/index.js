require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Credit = require("./models/Credits");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
app.listen(port, () => {
    console.log(`Credit Service running on port ${port}`);
});

app.get('/credits/:userId', async (req, res) => {
    try {
        const credit = await Credit.findOne({ userId: req.params.userId });
        if (!credit) return res.status(404).send('Credit not found');
        res.send(credit);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Add or update credits
app.post('/credits', async (req, res) => {
    const { userId, amount } = req.body;
    try {
        let credit = await Credit.findOne({ userId: userId });
        if (credit) {
            credit.balance += amount;
        } else {
            credit = new Credit({ userId, balance: amount });
        }
        await credit.save();
        res.send(credit);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});
