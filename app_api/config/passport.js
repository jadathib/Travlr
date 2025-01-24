const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String, required: true },
    // other fields as needed
});

// Hash password before saving it
userSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Method to check if the password matches
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Method to generate JWT
userSchema.methods.generateJwt = function() {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.JWT_SECRET, // Ensure you have this set in your .env file
        { expiresIn: '1h' }
    );
};

const User = mongoose.model('User', userSchema);
module.exports = User;
