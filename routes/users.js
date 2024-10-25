const express = require('express');
const router = express.Router();
const usersData = require('../users.json'); // Adjusted to access users.json

// Define the route to serve users data
router.get('/users', (req, res) => {
    res.json(usersData);
});

module.exports = router;
