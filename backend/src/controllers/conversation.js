const Conversation = require('../models/conversation')
const User = require('../models/user')
const Message = require('../models/message')

const openAndCreateCoversation = async (req, res) =>{
    try {
        const senderId = req.user.id
        const receiverId = req.body.receiverId
        const convoId = req.body.convoId //group conversation's ID

        if(convoId === false){
            if(!receiverId) throw new Error('Id required!')
                // check if chat or coversation already exist
            const conversationExist = await Conversation.find({
                isGroup:false,
                $and:[
                    {members:{$elemMatch:{$eq:senderId}}},
                    {members:{$elemMatch:{$eq:receiverId}}}
                ]
            })
            .populate('members', '_id username name email')
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
                .populate('members', '_id name username email picture')
                .populate('latestMessage', '_id createdAt message seen')
                res.send({
                    user: receiver,
                    data:populatedConvoData
                })
            }
        }
        else{
            // isGroup true
            // check if chat or coversation already exist
            // if(!groupId) throw new Error('Id required!')
            const conversationExist = await Conversation.findById(convoId)
            .populate('members', '_id username name email')
            .populate('latestMessage', '_id message seen')
            if(conversationExist){
                res.send({
                    message: 'Conversation already exist',
                    data:conversationExist
                })
            }
            
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
        .populate('members', '_id name username email picture')
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

const createGroupConversation = async (req, res) =>{
    try {
        const {name, users} = req.body;
        users.push(req.user.id)
        if(!name || !users) throw new Error("All the fields are required!")
        if(users.length < 2) throw new Error("Atleast 2 users are required to start group chat!") 
        let conversationData = {name, members:users, isGroup:true, admin:req.user.id, picture:process.env.DEFAULT_GROUP_PICTURE }
        const conversation = new Conversation(conversationData) 
        let convoData = await conversation.save()
        const populatedConvoData = await Conversation.findById({
            isGroup:true,
            _id:convoData._id
        })
        .populate('members', '_id name username email picture')
        .populate('latestMessage', '_id createdAt message seen')
        res.send({
            user: receiver,
            data:populatedConvoData
        })
    } catch (error) {
        
    }
}

module.exports = { openAndCreateCoversation, getConversations, createGroupConversation }


