// routes/index.js
const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication');

// Registration route
router.post('/register', authenticationController.register);

// Login route
router.post('/login', authenticationController.login);

module.exports = router;
