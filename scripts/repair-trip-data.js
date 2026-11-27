require('dotenv').config();
const mongoose = require('mongoose');
const { tripBackfill } = require('../app_api/models/trip-data');

async function repairTrips() {
    const apply = process.argv.includes('--apply');
    if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI to the Travlr database.');
    await mongoose.connect(process.env.MONGODB_URI);
    const trips = mongoose.connection.collection('trips');
    console.log('Database: ' + mongoose.connection.name + ' (' + (apply ? 'apply' : 'preview') + ')');

    for await (const trip of trips.find({})) {
        const fields = tripBackfill(trip);
        if (Object.keys(fields).length === 0) continue;
        if (!apply) {
            console.log(String(trip._id), trip.name, Object.keys(fields).join(', '));
            continue;
        }

        // Skip rows that changed since they were read, including edits from the admin app.
        const result = await trips.updateOne(
            { _id: trip._id, __v: trip.__v ?? null, updatedAt: trip.updatedAt ?? null },
            { $set: { ...fields, updatedAt: new Date() }, $inc: { __v: 1 } }
        );
        console.log(String(trip._id), result.modifiedCount ? 'updated' : 'skipped (changed)');
    }
}

repairTrips().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
}).finally(() => mongoose.disconnect());
