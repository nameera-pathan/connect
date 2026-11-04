const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    from: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['pending', 'connected'],
            message:'status must be either pending or connected'
        }
    },
    seen:{
        type:Boolean,
        default:false
    }
},{
    collection:'requests',
    timestamps:true
})

const Request = new mongoose.model('Request', requestSchema)
module.exports = Request


