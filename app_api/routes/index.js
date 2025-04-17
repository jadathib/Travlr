const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import controllers
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');
const reviewsController = require('../controllers/reviews');

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

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Trips routes
router.get('/trips', tripsController.getTrips);
router.post('/trips', auth, tripsController.createTrip);
router.get('/trips/:tripId', tripsController.getTripById);
router.put('/trips/:tripId', auth, tripsController.updateTrip);
router.delete('/trips/:tripId', auth, tripsController.deleteTrip);

// Reviews routes
router.get('/trips/:tripId/reviews', reviewsController.getReviewsByTrip);
router.post('/trips/:tripId/reviews', auth, reviewsController.createReview);
router.get('/reviews/:reviewId', reviewsController.getReviewById);
router.put('/reviews/:reviewId', auth, reviewsController.updateReview);
router.delete('/reviews/:reviewId', auth, reviewsController.deleteReview);

module.exports = router;
