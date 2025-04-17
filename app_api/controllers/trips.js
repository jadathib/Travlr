const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// Get all trips
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({});
        res.status(200).json(trips);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Create a new trip
const createTrip = async (req, res) => {
    try {
        const trip = new Trip(req.body);
        const newTrip = await trip.save();
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Get a specific trip by ID
const getTripById = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json(trip);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Update a trip
const updateTrip = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json(updatedTrip);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Delete a trip
const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const deletedTrip = await Trip.findByIdAndDelete(tripId);
        if (!deletedTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(204).json(null);
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    getTrips,
    createTrip,
    getTripById,
    updateTrip,
    deleteTrip
};
