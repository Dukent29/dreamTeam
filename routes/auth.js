// routes/auth.js
const express = require('express');
const { login, register, confirmEmail } = require('../controllers/authController');
const router = express.Router();

// Define the registration route
router.post('/register', register);

// Define the login route
router.post('/login', login);

router.get('/confirm/:token', confirmEmail);  // Email confirmation route

module.exports = router;
