const express = require("express");
const router = express.Router();
require("dotenv").config();
const orderSchema = require("../models/orders");
const userSchema = require("../models/users");
const { updateUserStripeSchema } = require("../validations/validations");
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_Id,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});
console.log(8);
let m = 0;
const createOrder = async () => {
  try {
    const orderDetails = await instance.orders.create({
      amount: 60000,

      receipt: `receipt${m}`,
      notes: {
        orderNumber: m,
      },
      currency: "INR",
      // partial_payment:true,
    });
    console.log(orderDetails, 88);
    m++;
  } catch (error) {
    console.log(error);
  }
};
// createOrder()

const listOrder = async () => {
  try {
    // fetch data for an order on the basis of receipt,  entity and also takes count,items as params for pagination
    const orderDetails = await instance.orders.fetchPayments(
      "order_NGzpM6COjpZIaA"
    );

    // fetch data for an order
    // const orderDetails  = await instance.orders.fetch('order_NGzpM6COjpZIaA')
    // console.log(orderDetails,88);

    // fetch all the payment attemps for an order
    // const orderDetails  = await instance.orders.fetchPayments('order_NGzpM6COjpZIaA')
    // console.log(orderDetails,88);

    //   update notes about the order
    // const orderDetails  = await instance.orders.edit('order_NGzpM6COjpZIaA',{
    //     notes:{orderNumber:1}
    // })
    console.log(orderDetails, 88);
  } catch (error) {
    console.log(error);
  }
};

// listOrder();

const craetePaymentLink = async () => {
  try {
    // const paymentDetails = await instance.paymentLink.create({
    //   amount: 200,
    //   currency: "INR",
    // //   accept_partial: true,
    // // upi_link:true, for creating upi payment link

    //   customer: {
    //     email: "singhsatpreet13@gmail.com",
    //     contact: "+91 6283515353",
    //     name: "Satpreet singh",
    //   },
    //   description: "Iphone X buying",
    // //   first_min_partial_amount: 100,
    // //   callback_method: "get"
    // callback_url:'http://localhost:3000',
    //   notes: {
    //     key1: "ok",
    //     key2: "bye",
    //   },
    // //   notify: {
    // //     sms: false,
    // //     email: false,
    // //   },
    // });

    // // getting info about payment links
    // // const paymentDetails = await instance.paymentLink.all({
    // //     // count:2,
        
    // //   });
    // console.log(paymentDetails, 88);

    // single payment link detail
    // const paymentDetails = await instance.paymentLink.fetch('plink_NH13SWjrQGQ8i3');
    // console.log(paymentDetails, 88);

     //notify for the single payment link by email or sms
    // const paymentDetails = await instance.paymentLink.notifyBy('plink_NH1nHvScu5Dc8L','sms');
    // console.log(paymentDetails, 88);

    //cancel any payment link made earlier
    const paymentDetails = await instance.paymentLink.cancel('plink_NH13SWjrQGQ8i3');
    console.log(paymentDetails, 88);
  } catch (error) {
    console.log(error);
  }
};

craetePaymentLink()
module.exports = router;
