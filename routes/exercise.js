const express = require('express');
const { createExercise } = require('../controllers/exerciseController');
const { authenticate, isCoach } = require('../middleware/auth');

const router = express.Router();

// Route to create an exercise (only accessible by coaches)
router.post('/', authenticate, isCoach, createExercise);

module.exports = router;
