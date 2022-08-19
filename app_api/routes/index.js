const express = require('express'); 
const router = express.Router(); 
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

router 
    .route('/login')
    .post(authController.login);

router 
    .route('/register')
    .post(authController.register); 

router
    .route('/trips') //take a request for trips
    .get(tripsController.tripsList) //pass it to the controller
    .post(auth, tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')//setting the route for the tripCode parameter
    .get(tripsController.tripsFindCode)// pass it to the controller
    .put(auth, tripsController.tripsUpdateTrip);
    
module.exports = router;