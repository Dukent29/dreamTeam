// routes/protected.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
    res.json({ message: 'Welcome to the protected route!' });
});

module.exports = router;
