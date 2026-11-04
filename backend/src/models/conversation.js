const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        required:true
    },
    isGroup:{
        type:Boolean,
        default:false,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
{
    collection:'conversations',
    timestamps:true
})

const Conversation = new mongoose.model('Conversation', conversationSchema)
module.exports = Conversation;  


