const express = require('express');
const { addChild } = require('../controllers/parentController');
const { authenticate, isParent } = require('../middleware/auth');

const router = express.Router();

router.post('/add-child', authenticate, isParent, addChild);

module.exports = router