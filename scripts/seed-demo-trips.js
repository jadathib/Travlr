require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../app_api/models/trips');
const { tripBackfill } = require('../app_api/models/trip-data');
const samples = require('../data/trips.json');

async function seedDemoTrips() {
    const firstDay = new Date();
    firstDay.setUTCHours(0, 0, 0, 0);
    firstDay.setUTCDate(firstDay.getUTCDate() + 30);

    const trips = Object.values(samples).map((sample, index) => {
        const start = new Date(firstDay);
        start.setUTCDate(start.getUTCDate() + index * 14);
        return new Trip({
            code: sample.code,
            name: sample.name,
            description: sample.description,
            ...tripBackfill({ ...sample, start })
        });
    });

    for (const trip of trips) await trip.validate();
    if (!process.argv.includes('--apply')) {
        for (const trip of trips) console.log(trip.code, trip.name, trip.startDate.toISOString());
        return;
    }

    if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI for the demo database.');
    await mongoose.connect(process.env.MONGODB_URI);

    for (const trip of trips) {
        const result = await Trip.updateOne(
            { code: trip.code },
            { $setOnInsert: trip.toObject({ virtuals: false }) },
            { upsert: true, timestamps: false }
        );
        console.log(trip.code, result.upsertedCount ? 'inserted' : 'already present');
    }
}

seedDemoTrips().catch(error => {
    console.error('Could not seed demo trips:', error.name);
    process.exitCode = 1;
}).finally(() => mongoose.disconnect());
