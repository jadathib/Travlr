const assert = require('node:assert/strict');
const test = require('node:test');
const Trip = require('../models/trips');
const { updateTrip } = require('../controllers/trips');

const id = '6aff1df2a1f73e2df6e7890a';

async function updateTripInMemory(context, body, tripData) {
    const trip = Trip.hydrate({ _id: id, ...tripData });
    context.mock.method(Trip, 'findById', async () => trip);
    context.mock.method(trip, 'save', async function (options) {
        await this.validate({ validateModifiedOnly: options.validateModifiedOnly });
        return this;
    });
    const response = {
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; }
    };
    await updateTrip({ params: { tripId: id }, body }, response);
    return response;
}

test('a historical trip accepts an unrelated edit', async context => {
    const response = await updateTripInMemory(context, {
        description: 'Description revised for a past trip.',
        startDate: '2021-02-14'
    }, { startDate: '2021-02-14', endDate: '2021-02-18' });
    assert.equal(response.statusCode, 200);
});

test('a start-only update cannot move the start after the stored end', async context => {
    const response = await updateTripInMemory(context, { startDate: '2099-10-03' }, {
        startDate: '2099-10-01', endDate: '2099-10-02'
    });
    assert.equal(response.statusCode, 400);
    assert.match(response.body.message, /after or equal/);
});

test('editing the thumbnail preserves the rest of the gallery', async context => {
    const response = await updateTripInMemory(context, { thumbnail: '/images/new.jpg' }, {
        images: ['/images/old.jpg', '/images/second.jpg']
    });
    assert.equal(response.statusCode, 200);
    assert.deepEqual([...response.body.images], ['/images/new.jpg', '/images/second.jpg']);
});

test('new trips still reject historical start dates', () => {
    const trip = new Trip({ startDate: '2021-02-14', endDate: '2021-02-18' });
    assert.match(trip.validateSync().errors.startDate.message, /today or in the future/);
});

test('a valid date range saves and is serialized with its duration', async context => {
    const response = await updateTripInMemory(context, {
        startDate: '2099-09-13', endDate: '2099-10-01'
    }, { startDate: '2099-09-13', endDate: '2099-09-26' });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.duration, 18);
});
