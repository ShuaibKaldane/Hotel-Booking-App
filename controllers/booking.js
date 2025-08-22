const Booking = require('../modules/booking.js');
const Listening = require('../modules/Listening.js');
const ExpressError = require('../utils/ExpressError.js');

// Check for booking conflicts
const checkBookingConflict = async (listingId, checkInDate, checkOutDate, excludeBookingId = null) => {
    const query = {
        listing: listingId,
        status: { $ne: 'cancelled' },
        $or: [
            {
                checkInDate: { $lte: checkInDate },
                checkOutDate: { $gt: checkInDate }
            },
            {
                checkInDate: { $lt: checkOutDate },
                checkOutDate: { $gte: checkOutDate }
            },
            {
                checkInDate: { $gte: checkInDate },
                checkOutDate: { $lte: checkOutDate }
            }
        ]
    };
    
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }
    
    const conflictingBooking = await Booking.findOne(query);
    return conflictingBooking;
};

// Calculate number of nights
const calculateNights = (checkInDate, checkOutDate) => {
    const timeDiff = new Date(checkOutDate) - new Date(checkInDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

module.exports.create = async (req, res) => {
    try {
        const { id } = req.params;
        const { booking } = req.body;
        
        // Find the listing
        const listing = await Listening.findById(id);
        if (!listing) {
            throw new ExpressError('Listing not found', 404);
        }
        
        // Validate dates
        const checkInDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkInDate < today) {
            throw new ExpressError('Check-in date cannot be in the past', 400);
        }
        
        if (checkOutDate <= checkInDate) {
            throw new ExpressError('Check-out date must be after check-in date', 400);
        }
        
        // Check for booking conflicts
        const conflict = await checkBookingConflict(id, checkInDate, checkOutDate);
        if (conflict) {
            throw new ExpressError('Already occupied for these dates', 409);
        }
        
        // Calculate total amount
        const nights = calculateNights(checkInDate, checkOutDate);
        const calculatedTotal = listing.price * nights * booking.numberOfRooms;
        
        // Verify the total amount matches calculation
        if (Math.abs(booking.totalAmount - calculatedTotal) > 0.01) {
            throw new ExpressError('Total amount calculation mismatch', 400);
        }
        
        // Create new booking
        const newBooking = new Booking({
            ...booking,
            listing: id,
            user: req.user._id,
            checkInDate,
            checkOutDate
        });
        
        await newBooking.save();

        req.flash('success', 'Booking done successfully! Enjoy your stay');
        res.redirect(`/listing/${id}`);
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(err => err.message).join(', ');
            throw new ExpressError(message, 400);
        }
        throw error;
    }
};

// Get user bookings
module.exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('listing')
            .sort({ createdAt: -1 });
        
        res.render('bookings/index.ejs', { bookings });
    } catch (error) {
        throw new ExpressError('Error fetching bookings', 500);
    }
};

// Cancel booking
module.exports.cancel = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            throw new ExpressError('Booking not found', 404);
        }
        
        if (!booking.user.equals(req.user._id)) {
            throw new ExpressError('Unauthorized to cancel this booking', 403);
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        req.flash('sucess', 'Booking cancelled successfully');
        res.redirect('/bookings');
    } catch (error) {
        throw error;
    }
};

// View booking details for property owners
module.exports.viewBookingDetails = async (req, res) => {
    try {
        const { listingId } = req.params;
        
        // Find the listing and verify ownership
        const listing = await Listening.findById(listingId);
        if (!listing) {
            throw new ExpressError('Listing not found', 404);
        }
        
        if (!listing.owner.equals(req.user._id)) {
            throw new ExpressError('Unauthorized to view booking details', 403);
        }
        
        // Get all bookings for this listing
        const bookings = await Booking.find({ 
            listing: listingId,
            status: { $ne: 'cancelled' }
        })
        .populate('user', 'username email')
        .populate('listing', 'title price')
        .sort({ createdAt: -1 });
        
        res.render('booking/details.ejs', { 
            bookings, 
            listing,
            title: `Booking Details - ${listing.title}`
        });
        
    } catch (error) {
        throw error;
    }
};