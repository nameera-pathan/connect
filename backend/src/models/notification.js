const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    to: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    seen:{
        type:Boolean,
        default:false
    },
    message:{
        type: String,
        lowercase:true,
        trim:true
    }
},
{
    collection:'notifications',
    timestamps: true
})

const Notification = new mongoose.model('Notifcaiton', notificationSchema)
module.exports = Notification




