const express = require("express");
const router = express.Router();
require("dotenv").config();
const orderSchema = require("../models/orders");
const userSchema = require("../models/users");
const {
  planValidationSchema,
  updatePlanValidationSchema,
} = require("../validations/validations");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const planSchema = require("../models/plans");
router.post("/new-plan", async (req, res) => {
  try {
    const { error } = planValidationSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send(error);
    } else {
      const { name, description, prices } = req.body;
      const newStripeProduct = await stripe.products.create({
        name,
        description,
      });
      let pricesData = [];
      if (newStripeProduct.id) {
        for (const [key, value] of Object.entries(prices)) {
          let priceData = { price_id: "", price: 0, duration: 0 };
          const newStripePrice = await stripe.prices.create({
            currency: "inr",
            unit_amount: value * 100,
            recurring: {
              interval: key,
            },
            // product_data:`The plan name is${name} and description is ${description}`,
            product: newStripeProduct.id,
          });
          if (newStripePrice.id) {
            priceData.price_id = newStripePrice.id;
            priceData.price = value;
            priceData.duration = key == "month" ? 1 : key == "year" ? 12 : 6;
            pricesData.push(priceData);
          }
        }
      }
      const mongoPriceObject = new planSchema({
        name,
        description,
        prices: pricesData,
        is_active: 1,
        product_id: newStripeProduct.id,
      });
      const saveProduct = await mongoPriceObject.save();
      if (saveProduct.id) {
        return res.status(200).send(saveProduct);
      } else {
        return res.status(400).send("Cannot create subscription plan !");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.put("/edit-plan/:planId", async (req, res) => {
  try {
    const { planId } = req.params;
    const {price_id,product_id,price,duration,name,description,is_active,_id} = req.body;
   
    let thingsToUpdate = {};
    let subThingsToUpdate = {};
    if (!planId) {
      return res.status(400).send("Required plan id !");
    } else {
        let query={};
        query._id=planId;
        query.prices={$elemMatch:{
            _id
        }}
      const plandetails = await planSchema.findOne(query);
      if (!plandetails) {
        return res.status(404).send("Plan not found !");
      }
      const { error } = updatePlanValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).send(error);
      } else {
        console.log(80);
        // return
         if (price || duration) {
          const earlyStripePrice = await stripe.prices.update(price_id, {
            active: false,
          });
          console.log(earlyStripePrice, 8);
          const stripePrice = await stripe.prices.create({
            currency: "inr",
            unit_amount: price * 100,
            product:product_id, 
           recurring: {interval:duration=='1' ?'month' :duration=='12' ?'year': earlyStripePrice.recurring.interval,}
          });
          subThingsToUpdate.price = price
            ? price
            : earlyStripePrice.unit_amount;
            subThingsToUpdate.price_id = stripePrice.id
            ? stripePrice.id
            : earlyStripePrice.unit_amount;
          subThingsToUpdate.duration = duration
            ? duration
            : earlyStripePrice.recurring;
        }
         else if (is_active !==undefined) {
          const stripePrice = await stripe.prices.update(price_id, {
            active: Boolean(is_active),
          });
          subThingsToUpdate.is_active = is_active;
        }
        const mongooseSubPlanUpdate = await planSchema.updateOne(
            { _id: planId ,"prices._id":_id},
            {$set:{
                "prices.$.price_id":subThingsToUpdate.price_id,
                "prices.$.price":subThingsToUpdate.price,
                "prices.$.duration":subThingsToUpdate.duration,
                "prices.$.is_active":subThingsToUpdate.is_active==0?0:1
            }}
          );
        console.log(mongooseSubPlanUpdate,7);
        return res.status(200).send('Plan update successful')
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

const a=async()=>{
  // await stripe.coupons.create({
  //   duration: 'repeating', // Valid for a specific duration
  //   duration_in_months: 5, // Valid for 5 months
  //   max_redemptions: 5, // Can be redeemed up to 5 times
  //   percent_off: 50, // Maximum 50% off
  //   name: 'Your Coupon Name',
  //   currency: 'usd', // Change the currency if needed
  // });
  
// console.log(coupon,8);
}
a()
module.exports = router;
