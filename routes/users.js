var express = require('express');
var router = express.Router();

// Example route for users
router.get('/', (req, res) => {
    res.send('User list will be here');
});

module.exports = router;
