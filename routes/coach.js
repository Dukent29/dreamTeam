const express = require('express');
const { authenticate, isCoach } = require('../middleware/auth');  // Assuming you have authentication middleware
const { getMyChildren } = require('../controllers/coachController');

const router = express.Router();

// Route to get the list of children assigned to the logged-in coach
router.get('/my-children', authenticate, isCoach, getMyChildren);

module.exports = router;
