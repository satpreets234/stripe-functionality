const Joi = require('joi');
const joi=require('joi');

const planValidationSchema=joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    prices:Joi.object().keys({
        month:Joi.number().required(),
        // quarterly:Joi.number().required(),
        // halfYearly:Joi.number().required(),
        year:Joi.number().required(),
    })
})

const updatePlanValidationSchema=joi.object({
    name:Joi.string().optional(),
    description:Joi.string().optional(),
    price_id:Joi.string().required(),
    product_id:Joi.string().required(),
    duration:Joi.string().optional(),
    is_active:Joi.string().optional().valid(0,1),
    price:Joi.number().optional(),
    _id:Joi.string().required()
})

const updateUserStripeSchema=joi.object({
    name:Joi.string().required(),
    line1:Joi.string().required(),
    postalCode:Joi.string().required(),
    state:Joi.string().required(),
    city:Joi.string().required(),
    country:Joi.string().required(),
    customer_id:Joi.string().required()
})

module.exports={planValidationSchema,updatePlanValidationSchema,updateUserStripeSchema}