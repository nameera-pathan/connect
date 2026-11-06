const Conversation = require('../models/conversation')
const User = require('../models/user')
const Message = require('../models/message')

const openAndCreateCoversation = async (req, res) =>{
    try {
        const senderId = req.user.id
        const receiverId = req.body.receiverId
        if(!receiverId) throw new Error('Id required!')
            // check if chat or coversation already exist
        const conversationExist = await Conversation.find({
            isGroup:false,
            $and:[
                {members:{$elemMatch:{$eq:senderId}}},
                {members:{$elemMatch:{$eq:receiverId}}}
            ]
        })
        .populate('members', '_id name email')
        .populate('latestMessage', '_id message seen')
        
        if(conversationExist[0]){
            res.send({
                message: 'Conversation already exist',
                data:conversationExist[0]
            })
        }
        else{
            // create conversation
            const receiver = await User.findById(receiverId).select('-password')
            const conversation = new Conversation({
                name:receiver.name,
                picture:receiver.picture,
                isGroup:false,
                members:[senderId, receiverId]
            })
            const convoData = await conversation.save()
            const populatedConvoData = await Conversation.findById({
                isGroup:false,
                _id:convoData._id
            })
            .populate('members', '_id name email picture')
            .populate('latestMessage', '_id createdAt message seen')
            res.send({
                user: receiver,
                data:populatedConvoData
            })
        }

    } catch (err) {
        res.status(400).send(err.message)
    }
}

const getConversations = async (req, res) =>{
    try {
        // console.log('USER HERE ------> ',req.user)
        const user = req.user
        const conversations = await Conversation.find({
            members:{$elemMatch:{$eq:user.id}},
        })
        .populate('members', '_id name email picture')
        .populate('latestMessage', '_id message createdAt seen')
        .sort({updatedAt:-1})
        res.send({
            message: 'Conversations fetched successfully',
            conversations
        })
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = { openAndCreateCoversation, getConversations }


