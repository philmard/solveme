const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const axios = require("axios");
const bodyParser = require('body-parser');
const {fetchUserProblems, fetchAllProblems} = require("./routes");

const cors = require('cors');
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

app.get("/fetchUserProblems", fetchUserProblems);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});