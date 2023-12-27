const express = require("express");
const router = express.Router();
require("dotenv").config();
const orderSchema = require("../models/orders");
const userSchema = require("../models/users");
const { updateUserStripeSchema } = require("../validations/validations");
const Razorpay = require("razorpay");
const {validatePaymentVerification} =require('razorpay/dist/utils/razorpay-utils')
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_Id,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});
// console.log(8);
// let m = 0;
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
}

// listOrder()

// validatePaymentVerification({
//   "payment_link_id": PaymentlinkId,
//   "payment_id": PaymentId,
//   "payment_link_reference_id": PaymentLinkReferenceId,
//   "payment_link_status": PaymentLinkStatus,
// }, signature , secret);

const craetePaymentLink = async () => {
  try {
    const paymentDetails = await instance.paymentLink.create({
      amount: 200,
      currency: "INR",
      accept_partial: true,
    // upi_link:true, for creating upi payment link
      customer: {
        email: "singhsatpreet13@gmail.com",
        contact: "+91 6283515353",
        name: "Satpreet singh",
      },
      description: "Iphone X buying",
    //   first_min_partial_amount: 100,
    //   callback_method: "get"
    callback_url:'http://localhost:3000',
      notes: {
        key1: "ok",
        key2: "bye",
      },
      options:{
        checkout:{
          name:'SD solutions',
          description:'technology and solutions guide',
          method:{
            card:1,
            upi:1,
            netbanking:0,
            wallet:0,
            paylater:0
          }
        }
      },
      notify: {
        sms: false,
        email: false,
      },
    });
    console.log(paymentDetails);
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

    // cancel any payment link made earlier
    // const paymentDetails = await instance.paymentLink.cancel('plink_NH13SWjrQGQ8i3');
    // console.log(paymentDetails, 88);
  } catch (error) {
    console.log(error);
  }
};

// craetePaymentLink()

const createInvoiceforUser = async() =>{
  try {
    // const invoiceData= await instance.invoices.create({
    //     type:'invoice',
    //     customer_id:'cust_NHMWYuYLPsBAqU',
    //     date: 1989994898,
    //     line_items:[{
    //       item_id:'item_NHMbYq6AtYefsz'
    //     }],
    //     description:'testing invoice creation',
    // })
// console.log(Math.floor(Date.now()/1000+30000),8);
    // inv_NHMp47nOtpcI1Q
    // const invoiceData= await instance.invoices.edit('inv_NHMoyuOqN5KUuG',{
    //   partial_payment:true, 
    //   // expire_by:Math.floor(Date.now()/1000+900) can be given after current date 15 mins
    //   // payment_amount:2000
    //   // options:{
    //   //   checkout:{
    //   //     netbanking:1,
    //   //     card:1,
    //   //     upi:1
    //   //   }
    //   // }
    // })
    // const qrCode= await instance.invoices.create({
    //   "type": "invoice",
    //   "date": 1989994898,
    //   "customer_id": "cust_NHMWYuYLPsBAqU",
    //   "line_items": [
    //     {
    //       "item_id": "item_NHMbYq6AtYefsz"
    //     }
    //   ]
    // })

    // const invoiceData =await instance.invoices.all({
    //   customer_id:'cust_NHMWYuYLPsBAqU'
    // })
    // console.log(invoiceData,8);

    // const invoiceNotify= await instance.invoices.notifyBy('inv_NHMoyuOqN5KUuG','email')
    // console.log(invoiceNotify,2);

    // const getInvoice= await instance.invoices.fetch('inv_NHMoyuOqN5KUuG')
    // console.log(getInvoice,2);


    // const getInvoice= await instance.invoices.cancel('inv_NHMoyuOqN5KUuG')
    // console.log(getInvoice,2);


    // const getInvoice= await instance.invoices.delete('inv_NHP9Rnj3P90XSc',)
    // console.log(getInvoice,2);  // only can be done for drafted invoice and none other
  } catch (error) {
    console.log(error);
  }
}

// createInvoiceforUser()

const createItem = async () =>{
    try {
      // const itemDetails=await  instance.items.create({
      //   name:"Iphone X",
      //   currency :'INR',
      //   amount:7790000,
      //   description:'A new phone came in the market'
      // })
      // console.log(itemDetails,9);

      // const itemDetail =await instance.items.fetch('item_NHPHcAvgrgrl1P');
      // console.log(itemDetail,8);

        // get all items
      // const itemDetail =await instance.items.all({
      //   count:2
      // });
      // console.log(itemDetail,8);

      // edit some created item
      // const itemDetail =await instance.items.edit('item_NHPHaipwexTdqR',{
      //   amount:6300000,
      //   currency:'NZD',
      //   active:false,
      //   description:'Prize revised for the given phone'
      // });
      // console.log(itemDetail,8);


      // delete some created item
      // const itemDetail =await instance.items.delete('item_NHPHaipwexTdqR');
      // console.log(itemDetail,8);
    } catch (error) {
      console.log(error,5);
    }
}

// createItem()


module.exports = router;
