const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set!');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        unique: true, 
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password') || this.isNew) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Validate password
userSchema.methods.validPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Error validating password');
    }
};

// Generate JWT
userSchema.methods.generateJwt = function() {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

    return jwt.sign(
        { 
            _id: this._id, 
            email: this.email,
            name: this.name,
            role: this.role
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: expiresIn
        }
    );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
