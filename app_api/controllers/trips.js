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
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const fields = ['name', 'description', 'destination', 'price', 'images',
            'startDate', 'endDate', 'rating', 'featured'];
        for (const field of fields) {
            if (Object.hasOwn(req.body, field)) trip.set(field, req.body[field]);
        }

        if (Object.hasOwn(req.body, 'thumbnail')) {
            const thumbnail = req.body.thumbnail;
            if (typeof thumbnail !== 'string' || !thumbnail.trim()) {
                return res.status(400).json({ message: 'Image is required.' });
            }
            trip.images = [thumbnail.trim(), ...(trip.images ?? []).slice(1)];
        }

        if (trip.isModified('startDate') || trip.isModified('endDate')) {
            if (!trip.startDate || !trip.endDate || trip.endDate < trip.startDate) {
                return res.status(400).json({ message: 'End date must be after or equal to start date' });
            }
        }

        await trip.save({ validateModifiedOnly: true });
        res.status(200).json(trip);
    } catch (err) {
        if (err instanceof mongoose.Error.VersionError) {
            return res.status(409).json({ message: 'This trip changed. Reopen it and try again.' });
        }
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
