const express = require("express");
const router = express.Router();
require("dotenv").config();
const orderSchema = require("../models/orders");
const userSchema = require("../models/users");
const subscriptionSchema = require("../models/subscriptions");

const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

router.post("/new-subscription", async (req, res) => {
  try {
    const {
      plan_details,
      payment_method,
      card_holder_name,
      card_brand,
      card_last_four,
      customer_id,
    } = req.body;
    if (!plan_details) {
      return res.status(400).send("Plan details required !");
    }
    if (
      false && (!payment_method ||
      !card_holder_name ||
      !card_brand ||
      !card_last_four )
    ) {
      return res.status(400).send("Missing payment details !");
    } else {
      try {
        const customerDetails = await stripe.customers.retrieve(customer_id);

        // const paymentMethod = await stripe.paymentMethods.list({
        //   customer: customer_id,
        //   type: "card",
        // });
        // console.log(paymentMethod);
        // return
        const subscriptionDetails = await stripe.subscriptions.create({
          customer: customer_id,
          // cancel_at_period_end: true,
          items: [{ price: plan_details.price_id }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
          trial_end:Math.floor(Date.now()/1000 +30*60)
        });
        // console.log(subscriptionDetails,8);
        if (subscriptionDetails) {
          // const verificationSession = await stripe.identity.verificationSessions.create({
          //   type: 'document',
          // });
          // console.log(verificationSession,8);
          return  res.status(200)
            .send(
              // verificationSession.url
             { client_secret:
                subscriptionDetails?.latest_invoice?.payment_intent
                  ?.client_secret,}
            );
        } else {
         return res.status(400).send("Cannot create client secret");
        }
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/update-subscription", async (req, res) => {
  try {
    const {
      price_id,
      customer_id,
      subscription_id
    } = req.body;
    if (!price_id) {
      return res.status(400).send("Plan details required !");
    }
    // if (
    //   !payment_method ||
    //   !card_holder_name ||
    //   !card_brand ||
    //   !card_last_four
    // ) {
    //   return res.status(400).send("Missing payment details !");
      try {
        const subscription = await stripe.subscriptions.list({
          customer:customer_id
        });
        if(subscription ){
          let subscriptionEndDate=subscription.data[0]?.cancel_at * 1000;
          // let subscriptionId=subscription.data[0]?.id;
          const subscriptionData = await stripe.subscriptions.retrieve(subscription_id);

          console.log(subscriptionData.items.data[0].id);
          // return
          if(subscriptionEndDate>Date.now()){
              const updateSubscription= await stripe.subscriptions.update(subscriptionData.id,{
                  items:[{price:price_id,id:subscriptionData.items.data[0].id}],
                  proration_date:Math.floor(Date.now()/1000),
                  proration_behavior: 'create_prorations',
                  payment_behavior: "default_incomplete",
                  expand: ["latest_invoice.payment_intent"]
              })
              console.log(updateSubscription);
              return  res.status(200)
              .send(
                // verificationSession.url
               { client_secret: 
                updateSubscription?.latest_invoice?.payment_intent
                    ?.client_secret}
              );
          }else{
            return res.status(204).send("Subscription Ended");
          }
        }else{
          return res.status(409).send("Subscription Not Purcahsed");
        }
        
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
