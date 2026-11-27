const assert = require('node:assert/strict');
const test = require('node:test');
const { tripBackfill, tripView } = require('../models/trip-data');
const { travelList } = require('../../app_server/controllers/travel');
const Trip = require('../models/trips');

const legacy = {
    name: 'Gale Reef', resort: 'Emerald Bay', perPerson: '1,250.00',
    image: 'reef1.jpg', start: '2021-02-14T08:00:00Z', length: '4 nights / 5 days'
};

test('legacy trips use the same image, price and duration on both surfaces', async context => {
    const apiTrip = tripView(legacy);
    assert.equal(apiTrip.duration, 4);
    assert.equal(apiTrip.price, 1250);
    assert.deepEqual(apiTrip.images, ['/images/reef1.jpg']);
    context.mock.method(Trip, 'find', () => ({ lean: async () => [legacy] }));
    await travelList({}, {
        render(view, { trips }) {
            assert.equal(view, 'travel');
            assert.equal(trips[0].thumbnail, apiTrip.images[0]);
            assert.equal(trips[0].priceLabel, '$1,250.00');
            assert.equal(trips[0].lengthLabel, '4 nights / 5 days');
        }
    });
});

test('the repair fills missing values and leaves saved values in place', () => {
    const trip = {
        ...legacy, destination: 'Updated resort', price: 0,
        images: ['https://example.com/asia.jpg', '/images/reef2.jpg']
    };
    const changes = tripBackfill(trip);
    assert.deepEqual(Object.keys(changes), ['startDate', 'endDate']);
    assert.deepEqual(tripBackfill({ ...trip, ...changes }), {});
    assert.deepEqual(tripView(trip).images, trip.images);
    assert.equal(tripView(trip).price, 0);
});

test('missing source data stays missing', () => {
    assert.deepEqual(tripBackfill({ length: 'unknown', perPerson: '' }), {});
    assert.equal(tripView({}).duration, undefined);
});
