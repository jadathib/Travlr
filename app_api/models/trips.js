const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Trip name is required'],
        trim: true,
        minlength: [3, 'Trip name must be at least 3 characters long'],
        maxlength: [100, 'Trip name cannot exceed 100 characters']
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true,
        minlength: [3, 'Destination must be at least 3 characters long'],
        maxlength: [100, 'Destination cannot exceed 100 characters']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(value) {
                // Start date must be in the future
                return value >= new Date(new Date().setHours(0, 0, 0, 0));
            },
            message: 'Start date must be today or in the future'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function(value) {
                // End date must be after or equal to start date
                return value >= this.startDate;
            },
            message: 'End date must be after or equal to start date'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function(value) {
                // Price must be a valid number with at most 2 decimal places
                return /^\d+(\.\d{1,2})?$/.test(value.toString());
            },
            message: 'Price must be a valid number with at most 2 decimal places'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    images: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: 4
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Add index for better query performance
tripSchema.index({ destination: 1 });
tripSchema.index({ startDate: 1 });
tripSchema.index({ price: 1 });
tripSchema.index({ featured: 1 });

// Virtual for trip duration
tripSchema.virtual('duration').get(function() {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for reviews - this will allow us to populate reviews for a trip
tripSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'trip'
});

// Method to get average rating from reviews
tripSchema.methods.getAverageRating = async function() {
    const Review = mongoose.model('Review');
    const result = await Review.aggregate([
        { $match: { trip: this._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    return result.length > 0 ? result[0].avgRating : 0;
};

// Ensure virtuals are included in JSON output
tripSchema.set('toJSON', { virtuals: true });
tripSchema.set('toObject', { virtuals: true });

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;
