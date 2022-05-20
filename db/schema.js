const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    accountNumber:{
        type:Number,
        required:true,
    },
    city:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true,
    },
    history:{
        name:{
            type:String
        },
        send:{
            type:String
        },
        receive:{
            type:String
        }
    }
})

const userCollection = new mongoose.model('customer',userSchema);

module.exports=userCollection;