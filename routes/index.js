var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

// Define a Mongoose schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

// Example route
router.get('/', (req, res) => {
    res.send('Welcome to the index route!');
});

module.exports = router;
