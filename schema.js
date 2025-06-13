const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.string().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        imageUrl:Joi.string().allow("",null),
        category:Joi.string().valid("mountain","room", "trending","pool","farm","arctic","historicalHomes","lakefront ","camping ").required()
    })
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().required()
        })
})