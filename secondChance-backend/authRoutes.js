const express = require('express');
const router = express.Router();

// Example route for authentication
router.get('/login', (req, res) => {
    res.send('Login route works!');
});

module.exports = router;
