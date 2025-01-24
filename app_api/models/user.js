// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Add a method to hash the password
userSchema.methods.setPassword = function(password) {
    this.password = bcrypt.hashSync(password, 10);
};

// Add a method to generate JWT
userSchema.methods.generateJwt = function() {
    return jwt.sign({ _id: this._id, name: this.name, email: this.email }, 'your_jwt_secret', { expiresIn: '1h' });
};

// Register the schema as a model
const User = mongoose.model('users', userSchema);

module.exports = User;
