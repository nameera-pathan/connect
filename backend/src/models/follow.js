const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    following: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['followed'],
            message: `{Value} incorrect status type!`
        }
    }
},
{timestamps: true})

const Follow = new mongoose.model('Follow',  followSchema)

module.exports = Follow