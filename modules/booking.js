const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    numberOfRooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.checkInDate;
            },
            message: 'Check-out date must be after check-in date'
        }
    },
    paymentMode: {
        type: String,
        default: 'Cash',
        enum: ['Cash', 'Card', 'UPI']
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listening',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    }
});

// Index for efficient conflict checking
bookingSchema.index({ listing: 1, checkInDate: 1, checkOutDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;