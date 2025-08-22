const Joi = require('joi');
module.exports.Listingschema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0), // Changed from string to number
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        })
    }).required()

})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
}).required()

// Add booking validation schema
module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        fullName: Joi.string().required().trim().min(2).max(50),
        numberOfRooms: Joi.number().required().min(1).max(10),
        numberOfGuests: Joi.number().required().min(1).max(20),
        checkInDate: Joi.date().required().min(new Date().toISOString().split('T')[0]),
        checkOutDate: Joi.date().required().greater(Joi.ref('checkInDate')),
        paymentMode: Joi.string().valid('Cash', 'Card', 'UPI').default('Cash'),
        totalAmount: Joi.number().required().min(0)
    }).required()
}).required()