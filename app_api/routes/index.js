const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Import controllers
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

// Authentication middleware
const auth = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Authentication required. No token provided.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user to request
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Invalid or expired token' 
        });
    }
};

const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('role');
        if (user?.role !== 'admin') {
            return res.status(403).json({ message: 'An administrator account is required.' });
        }
        next();
    } catch (err) {
        next(err);
    }
};

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Trips routes
router.get('/trips', tripsController.getTrips);
router.post('/trips', auth, requireAdmin, tripsController.createTrip);
router.get('/trips/:tripId', tripsController.getTripById);
router.put('/trips/:tripId', auth, requireAdmin, tripsController.updateTrip);
router.delete('/trips/:tripId', auth, requireAdmin, tripsController.deleteTrip);

module.exports = router;
