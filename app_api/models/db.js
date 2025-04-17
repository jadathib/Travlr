const mongoose = require('mongoose');

// Use your connection string here
const dbURI = 'mongodb+srv://JadaThibodeaux:Bitchpleaze1!@cluster0.z80ru.mongodb.net/';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongoose connected successfully'))
    .catch(err => console.log('Mongoose connection error:', err));


// Log database connection events
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Import schemas
require('./user'); // Ensure the `user` schema is registered
require('./trips'); // Register the `trips` schema
require('./reviews'); // Register the `reviews` schema
