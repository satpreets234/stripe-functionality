const mongoose=require('mongoose');

const orderSchema= new mongoose.Schema({
    orderDetail:{
        type:Object
    }
})

module.exports= mongoose.model('orders',orderSchema)