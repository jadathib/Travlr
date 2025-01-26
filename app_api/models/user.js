const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },  // Assuming you also want a name field
});

// Hash password before saving
userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Validate password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Generate JWT
userSchema.methods.generateJwt = function() {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
