const mongoose=require('mongoose');

const subscriptionSchema= new mongoose.Schema({
    subscriptionDetail:{
        type:Object
    }
})

module.exports= mongoose.model('subscriptions',subscriptionSchema)