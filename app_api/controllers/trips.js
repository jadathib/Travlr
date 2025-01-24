const mongoose = require('mongoose');
const Trip = mongoose.model('trips'); // Ensure "trips" matches the name in `mongoose.model('trips', tripSchema)`

const getTrips = (req, res) => {
    Trip.find({}, (err, trips) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(200).json(trips);
    });
};

const createTrip = (req, res) => {
    const trip = new Trip(req.body);
    trip.save((err, newTrip) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(201).json(newTrip);
    });
};

module.exports = {
    getTrips,
    createTrip,
};
