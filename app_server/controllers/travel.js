const Trip = require('../../app_api/models/trips');
const { tripView } = require('../../app_api/models/trip-data');

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const travelList = async (req, res) => {
    const title = 'Travlr Getaways - Travel';

    try {
        const records = await Trip.find({}).lean();
        const trips = records.map(record => {
            const trip = tripView(record);
            return {
                ...trip,
                thumbnail: trip.images?.[0],
                lengthLabel: trip.duration == null ? trip.length
                    : trip.duration + ' nights / ' + (trip.duration + 1) + ' days',
                priceLabel: Number.isFinite(trip.price) ? currency.format(trip.price) : null,
                descriptionText: (trip.description || '').replace(/<[^>]*>/g, ' ').trim()
            };
        });
        return res.render('travel', {
            title, trips, message: trips.length ? null : 'No trips are available yet.'
        });
    } catch (error) {
        console.error('Unable to load trips:', error.message);
        return res.status(503).render('travel', { title, trips: [], message: 'Trips are temporarily unavailable.' });
    }
};

module.exports = { travelList };
