const express = require("express");
const router = express.Router();
require("dotenv").config();
const orderSchema = require("../models/orders");
const userSchema = require("../models/users");
const { updateUserStripeSchema } = require("../validations/validations");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
// // console.log(2);
// const createAccount =async ()=>{
//     try {

//         // const account = await stripe.accounts.create({
//         //     country: 'US',
//         //     type: 'express',
//         //     capabilities: {
//         //       card_payments: {
//         //         requested: true,
//         //       },
//         //       transfers: {
//         //         requested: true,
//         //       },
//         //     },
//         //     business_type: 'individual',
//         //     // business_profile: {
//         //     //   url: 'https://example.com',
//         //     // },
//         //   });
//         const account = await stripe.accounts.create({
//             country: 'US',
//                 type: 'express',
//                 email:'singh1@yopmail.com',
//                 capabilities: {
//                   card_payments: {
//                     requested: true,
//                   },
//                   transfers: {
//                     requested: true,
//                   },
//                 },
//                 // business_name:'abc.jjjk',
//                 business_type: 'individual',
//                 business_profile: {
//                     name:'abc.jjjk'
//                 //   url: 'https://example.com',
//                 },
//           });
//           console.log(account,99);
//           const accountLink = await stripe.accountLinks.create({
//             account: account.id,
//             refresh_url: 'http://localhost;8008/',
//             return_url: "http://localhost;8008/",
//             type: 'account_onboarding',
//           });
//           console.log(accountLink.url);
//     } catch (error) {
//         console.log(error);
//     }
// }
// // createAccount()

// // const createTransfer =async () =>{
// //     try {
// //         const transfer = await stripe.transfers.create({
// //             amount: 4,
// //             currency: 'aud',
// //             destination: 'acct_1OHmomPGTbjNWU6f',
// //             transfer_group: 'ORDER_95',
// //           });
// //     } catch (error) {
// //         console.log(error);
// //     }
// // }
// const a=async()=>{
// try {
//     const balance = await stripe.balance.retrieve();
// console.log(balance);
// } catch (error) {
    
// }
// }
// // a()

// // createTransfer()
// // when a new user is created from stripe.accounts.create(type:'express')
// // so how to complete this users kyc i.e stripe 

// // stripe.charges.create({
// //     amount: 1000,  // Amount in cents, e.g., $10.00
// //     currency: 'usd',
// //     source: 'tok_visa',  // Use a test token for card payments
// //     description: 'Test charge for adding funds',
// //   }, function(err, charge) {
// //     if (err) {
// //       console.error(err);
// //     } else {
// //       console.log(charge);
// //     }
// //   });

// const m = async () =>{
//     try {

//       const paymentMethod = await stripe.paymentMethods.create({
//         type: 'card',
//         card: {
//           number: '4242424242424242',
//           exp_month: 8,
//           exp_year: 2026,
//           cvc: '314',
//         },
//       });
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: 1099,
//         currency: 'usd',
//         payment_method_types: ['card'],
//         capture_method: 'manual',
//         payment_method:paymentMethod.id,
//         confirm:true,
//         description:'uivghfgc thgt',
//         // automatic_payment_methods: {
//         //   enabled: true,
//         // },
//         // payment_method_options: {
//         //   card: {
//         //     capture_method: 'manual',
//         //   },
//         // },
//         customer:"cus_PDmAKlK2HKvhdr",
//         return_url:'http://localhost:3000'
//       });
//         console.log(paymentIntent,8);
       
//         const confirmIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
//         })
//         console.log(confirmIntent,88);
//         // const intent = await stripe.paymentIntents.capture('pi_3ORZADSGKYaLOMeb01SqAxas', {
//         //   amount_to_capture: 750,
//         // })
//         // console.log(intent);
        
//     } catch (error) {
//       console.log(error,88);
//     }

   
// }
// m()


module.exports= router;


