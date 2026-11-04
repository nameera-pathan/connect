const Message = require('../models/message')
const Conversation = require('../models/conversation')

const sendMessage = async (req, res) =>{
    try {
        const user = req.user
        const {textmessage, conversationId} = req.body
        // console.log('Message here --->', req.body)
        const message = new Message({
            sender:user._id,
            conversation:conversationId,
            message: textmessage,
            mediaFiles: req.body.files ? req.body.files : [] ,
        })
        const msg = await message.save()
        const populatedMsg = await Message.findById({
            _id:msg._id
        })
        .populate('sender', '_id name picture')
        .populate('conversation', '_id name picture isGroup members')
        const conversation = await Conversation.findByIdAndUpdate(conversationId,{
            latestMessage: msg._id
        })
        await conversation.save()
        const populatedConvo = await Conversation.findById(conversationId)
        .populate('members', '_id name email picture')
        .populate('latestMessage', '_id message createdAt seen')
        .sort({updatedAt:-1})
        res.send({
            message: 'message sent successfully',
            data:populatedMsg,
            conversation: populatedConvo
        })
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const getConversationMessages = async (req, res) =>{
    try {
        const conversationId = req.params.convoId
        const chat = await Message.find({conversation: conversationId})
        .populate('sender', '_id name picture')
        .populate('conversation', '_id name picture isGroup members')
        .sort({updatedAt:1})
        res.send({
            message:'200 ok',
            data:chat
        })
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = { sendMessage, getConversationMessages }

