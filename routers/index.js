const express = require("express");
const router = express.Router();
require("dotenv").config();
const orderSchema = require("../models/orders");
const userSchema = require("../models/users");
const { updateUserStripeSchema } = require("../validations/validations");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
router.get("/", (req, res) => {
  res.render("index");
});
router.get("/success", async (req, res) => {
  res.render("payment-success");
});

router.post("/signup", async (req, res) => {
  try {
    let { email, password } = req.body;
    const userEmail = await userSchema.findOne({ email });
    if (!userEmail) {
      let newUserData = new userSchema({ email, password });
      let newUser = await newUserData.save();
      if (newUser._id) {
        // const stripeCustomer=await stripe.const customer = await stripe.customers.create({
        //   description: 'My First Test Customer (created for API docs)',
        // })
        const stripeCustomer = await stripe.customers.create({
          email,
          description: `My email is ${email} and password is X55!${password}!@#!@`,
        });
        if (stripeCustomer) {
          newUser.customer_id = stripeCustomer.id;
          newUser.save();
          return res.status(200).send("Registration successfull");
        } else {
          newUser.deleteOne();
          return res.status(400).send("Registration failed ,please try again!");
        }
      } else {
        return res.status(400).send("Registration failed ,please try again!");
      }
    } else {
      return res.status(400).send("Duplicate email!");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/update-user-details", async (req, res) => {
  try {
    const { customer_id, country, city, postalCode,name ,line1,state} = req.body;
    try {
      const userDetail = await stripe.customers.retrieve(customer_id);
      if (userDetail) {

        const { error } = updateUserStripeSchema.validate(req.body);
        if (error) {
          return res.status(400).send(error);
        } else {
          const customer = await stripe.customers.update(
            customer_id,
            { name,
              address:{ 
              line1,
              postal_code:postalCode,
              city,
              country,
              state}
            }
          )
          return res.status(200).send(customer)
        }
      }
    } catch (error) {
      // else{
        console.log(error);
      const stripeCustomer = await stripe.customers.create({
        email,
        description: `My email is ${email} and password is X55!!@#!@`,
      });
      if (stripeCustomer.id) {
        console.log(9);
        return res.status(200).send(stripeCustomer);
      } else {
        console.log(10);
        return res.status(400).send("Cannot get stripe details");
      }
      // }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
router.get("/checkout", async (req, res) => {
  try {
    // if(req.query.coupon){
    //     const couponValid=await stripe.coupons.retrieve(req.query.coupon)
    //     console.log(new Date((couponValid.created +86400*90)*1000),new Date(Date.now()));
    //     if((couponValid.created +86400*90)*1000<Date.now()){
    //     console.log(8);
    //     }else{
    //         console.log(9);
    //     }
    // }
    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:8008/success",
      cancel_url: "http://localhost:8008/",
      line_items: [{ price: "price_1O8HeNSGKYaLOMebhlL6n9z9", quantity: 1 }],
      mode: "payment",
      customer:'cus_OwFNp20ae8OvxL'
      // discounts: [{ coupon: "GhhMXbPT" }],
    });
    //
    if (session.id) {
      return res.status(200).send(session);
    } else {
      return res.status(400).send("Cannot create session");
    }
    // stripe.redirectToCheckout({session_id:session.id})
    console.log(session);
  } catch (error) {
    return res.status(500).send(error);
  }
});
const a = async () => {
  console.log(new Date(Math.floor(Date.now()) + 1000 * 30 * 24 * 60 * 60));
  // const coupon = await stripe.coupons.create({
  //     name: 'My Coupon',
  //     percent_off: 20, // 20% discount
  //     duration: 'once', // One-time use
  //     redeem_by: Math.floor(Date.now()/1000 ) + 1000*30 * 24 * 60 * 60, // Expire in 30 days (Unix timestamp)
  //   });
};
// a();
router.post("/create-price", async (req, res) => {
  try {
    let { unit_amount, currency, billingScheme, product } = req.body;
    const productDetails = await stripe.products.retrieve(product);
    console.log(productDetails, 88);
    if (productDetails) {
      const price = await stripe.prices.create({
        unit_amount,
        currency,
        billing_scheme: billingScheme,
        //   recurring: {interval: 'month'},
        product,
      });
      return res.status(200).send(price);
    } else {
      return res.status(404).send("Not found");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/create-webhook", async (req, res) => {
  try {
    const webhookEndpoint = await stripe.webhookEndpoints.create({
      url: "http://192.168.1.10:8000/webhook/payment-check",
      enabled_events: [
        "checkout.session.async_payment_failed",
        "checkout.session.async_payment_succeeded",
        "checkout.session.completed",
        "checkout.session.expired",
      ],
    });
    console.log(webhookEndpoint, 11);
    if (webhookEndpoint) {
      return res.status(200).send(webhookEndpoint);
    } else {
      return res.status(400).send("Cannot create webhook");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/update-webhook", async (req, res) => {
  try {
    const webhookEndpoint = await stripe.webhookEndpoints.update(
      "we_1OA3p7SGKYaLOMeb8JEqWQpm",
      {
        url: "https://3397-2401-4900-1f32-8fff-00-41-59f0.ngrok-free.app/membership/webhook",
        enabled_events: [
          "payment_intent.created",
          "payment_intent.payment_failed",
          "checkout.session.expired",
          "checkout.session.completed",
          "checkout.session.expired",
          "checkout.session.async_payment_succeeded",
          "payment_intent.created",
          "payment_intent.succeeded",
          "payment_intent.payment_failed",
        ],
      }
    );

    console.log(webhookEndpoint);
    return res.status(200).send(webhookEndpoint);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
router.post("/webhook/payment-check", async (req, res) => {
  try {
    const event = req.body;
    let orderData;
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        console.log(event.data, 1);
        orderData = new orderSchema({ orderDetail: event.data });
        orderData = await orderData.save();
        res.status(400).send({ orderData, message: "payment failed" });
        console.log(event.data, 3);
      case "checkout.session.completed":
        console.log(event.data, 2);
        orderData = new orderSchema({ orderDetail: event.data });
        orderData = await orderData.save();
        // const invoiceItem = await stripe.invoiceItems.create({
        //   customer: 'cus_xxxxxxxxxxxxx',
        //   price: 'price_xxxxxxxxxxxxx',
        // })
        res.status(200).send(orderData);
        break;
      case "checkout.session.expired":
        res.status(400).send("checkout session expired");
        console.log(event.data, 3);
      case "checkout.session.async_payment_succeeded":
        console.log(event.data, 4);
        orderData = new orderSchema({ orderDetail: event.data });
        res.status(200).send(orderData);
        break;
      case "payment_intent.created":
        console.log(event.data, 5);
        // orderData = new orderSchema({ orderDetail: event.data });
        res.status(200).send("Payment intent created");
        break;
      case "payment_intent.succeeded":
        console.log(event.data, 6);
        // orderData = new orderSchema({ orderDetail: event.data });
        res.status(200).send("Payment intent succeeded");
        break;
      case "payment_intent.payment_failed":
        console.log(event.data, 7);
        // orderData = new orderSchema({ orderDetail: event.data });
        res.status(400).send("Payment intent failed");
        break;
      default:
        console.log(event.data, 8);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/create-refund", async (req, res) => {
  try {
    let { payment_intent } = req.body;
    if (!payment_intent) {
      return res.status(400).send("Payment intent is required");
    }
    const refund = await stripe.refunds.create({
      payment_intent,
    });
    console.log(refund);
    if (refund) {
      return res.status(200).send(refund);
    } else {
      return res.status(400).send("Cannot find payment intent");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get("/get-user-stripe-details", async (req, res) => {
  try {
    let { customer_id, email } = req.body;
    try {
      const userDetail = await stripe.customers.retrieve(customer_id);
      if (userDetail) {
        console.log(8);
        return res.status(200).send(userDetail);
      }
    } catch (error) {
      // else{
      const stripeCustomer = await stripe.customers.create({
        email,
        description: `My email is ${email} and password is X55!!@#!@`,
      });
      if (stripeCustomer.id) {
        console.log(9);
        return res.status(200).send(stripeCustomer);
      } else {
        console.log(10);
        return res.status(400).send("Cannot get stripe details");
      }
      // }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
