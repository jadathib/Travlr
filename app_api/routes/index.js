const express = require('express'); 
const router = express.Router(); 

const tripsController = require('../controllers/trips');

router 
    .route('/trips') //take a request for trips
    .get(tripsController.tripsList); //pass it to the controller

router
    .route('/trips/:tripCode')//setting the route for the tripCode parameter
    .get(tripsController.tripsFindCode);// pass it to the controller
    
module.exports = router;