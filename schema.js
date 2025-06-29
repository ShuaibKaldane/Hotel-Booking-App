const Joi = require('joi');
module.exports.Listingschema = Joi.object({
    Listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.string().required(),
        image:Joi.string().allow("", null)

    }).required()

})