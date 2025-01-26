const express = require('express');
const router = express.Router();

// Import your controllers properly
const authController = require('../controllers/authentication'); // Ensure correct path

// Define routes with proper handler functions
router.post('/login', authController.login);  // Should be the login function from authentication.js
router.post('/register', authController.register);  // Should be the register function from authentication.js

module.exports = router;

