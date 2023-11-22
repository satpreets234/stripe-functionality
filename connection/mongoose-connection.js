const mongoose=require('mongoose');
async function connection (){
    mongoose.connect('mongodb://localhost:27017/admin').then((success)=>{
            console.log('Database connection established!');
        }).catch((error)=>{
            console.log(error);
        })
}
module.exports={connection};