const express = require('express');
const { addTrainingSession, getTrainingSessionsForCoach } = require('../controllers/trainingSessionController');
const { authenticate, isCoach } = require('../middleware/auth');

const router = express.Router();

// Route to add a new training session (restricted to coaches)
router.post('/', authenticate, isCoach, addTrainingSession);

// Route to get all training sessions for the logged-in coach
router.get('/', authenticate, isCoach, getTrainingSessionsForCoach);

module.exports = router;
