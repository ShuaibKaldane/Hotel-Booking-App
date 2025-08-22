const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { bookingSchema } = require('../schema.js');
const { isLogedin } = require('../middleware/auth.js');
const { create, getUserBookings, cancel } = require('../controllers/booking.js');

// Server-side validation for bookings
const validateBooking = (req, res, next) => {
    console.log('Booking validation - req.body:', req.body);
    
    // Convert numeric fields
    if (req.body.booking) {
        if (req.body.booking.numberOfRooms) {
            req.body.booking.numberOfRooms = Number(req.body.booking.numberOfRooms);
        }
        if (req.body.booking.numberOfGuests) {
            req.body.booking.numberOfGuests = Number(req.body.booking.numberOfGuests);
        }
        if (req.body.booking.totalAmount) {
            req.body.booking.totalAmount = Number(req.body.booking.totalAmount);
        }
    }
    
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        console.log('Validation error:', error.details);
        const message = error.details.map(el => el.message).join(', ');
        throw new ExpressError(message, 400);
    } else {
        console.log('Validation passed');
        next();
    }
};

// Create booking
router.post('/listing/:id/book', isLogedin, validateBooking, wrapAsync(create));

// Get user bookings
router.get('/bookings', isLogedin, wrapAsync(getUserBookings));

// Cancel booking
router.put('/bookings/:bookingId/cancel', isLogedin, wrapAsync(cancel));

module.exports = router;