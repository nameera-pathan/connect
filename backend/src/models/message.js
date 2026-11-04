const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
    },
    message:{
        type:String,
        trim:true
    },
    mediaFiles:[],
    seen: { 
        type: Boolean,
        default: false
    }
},{
    collection:'messages',
    timestamps:true
})

const Message = new mongoose.model('Message', messageSchema)
module.exports = Message

