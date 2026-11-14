const Request = require('../models/request')
const User = require('../models/user')
const Notification = require('../models/notification')

const sendRequest = async (req, res) =>{
    try {
        const from = req.user.id
        const to = req.body.userId
        const status = "pending"
        if(from.toString() === to.toString()) throw new Error('cannot send request to yourself!')
        const userExist = await User.findById({ _id:to })
        if(!userExist) throw new Error('User not found!')
        const requestExist = await Request.findOne({
            $or:[{ from, to }, { from: to, to:from }]
        })
        .populate('from', 'name username email picture _id')
        .populate('to', 'name username email picture _id')
        if(requestExist) {
            res.send({
                message: 'Friend request already exist!',
                data:requestExist
            })
        }
        else{
            const friendRequest = new Request({
                from,
                to,
                status
            })
            await friendRequest.save()
            const request = await Request.findById({_id:friendRequest._id})
            .populate('from', 'name username email picture _id')
            .populate('to', 'name username email picture _id')
            const notify = new Notification({ 
                to,
                message:`@${request.from.username} sent you a friend request.` 
            })
            await notify.save()
            res.send({
                message: "Friend request sent!",
                data:request
            })
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const viewAllRequests = async (req, res) =>{
    try {
        const to = req.user.id
        const status = "pending"
        const requests = await Request.find({
            to,
            status
        })
        .populate('from', 'name username email picture _id')
        if(requests.length < 1) return res.send({
            message: 'No friend requests yet!',
            data: null
        })
        res.send({
            message: "Friend requests fetched successfully!",
            data:requests
        })
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const acceptAndRejectRequests = async (req, res) => {
    try{
        const user = req.user.id
        const { status, requestId } = req.body
        const allowedStatus = ['accept', 'reject']
        if(!allowedStatus.includes(status)) throw new Error('Invalid status!')
        const requestIdExist = await Request.findById(requestId)    
        if(!requestIdExist) throw new Error('Friend request ID not found!')

        const request = await Request.findOne({ _id:requestId, to:user }) 
        if(request.status === 'connected') return res.send({message:'you both are already friends.'})
        if(!request) throw new Error('Friend request not found!')  

        if(status === 'accept') {
            request.status = 'connected'
            const data = await request.save()
            const loggedInUser = await User.findOne({ _id: user });
            const loggedInUserFriends = await Request.countDocuments({
                $or: [
                    { to: loggedInUser._id, status: 'connected' },
                    { from: loggedInUser._id, status: 'connected' }
                ]
            }); 
            const connectedUser = await User.findById({ _id: request.from });
            const connectedUserFriends = await Request.countDocuments({
                $or: [
                    { to: request.from, status: 'connected' },
                    { from: request.from, status: 'connected' }
                ]
            });
            loggedInUser.friends = loggedInUserFriends
            connectedUser.friends = connectedUserFriends
            await loggedInUser.save()
            await connectedUser.save()
            const notify = new Notification({
                to:request.from,
                message:`${loggedInUser.username} accepted your friend request.`
            })
            await notify.save()
            res.send({
                message: `you and ${connectedUser.username} are now friends.`,
                // you:loggedInUserFriends,
                // other: connectedUserFriends,
                data,
            })
        }
        else{
            const data = await Request.deleteOne({_id:requestId})
            res.send({
                message:"Request rejected!",
                data
            })
        }
    }catch(err){
        res.status(400).send(err.message)
    }
}

const viewAllFriends = async (req, res) =>{
    try{
        const user = req.user.id
        const AllFriends = await Request.find({
            $or: [
                { to: user, status: 'connected' },
                { from: user, status: 'connected' }
            ]
        })
        .populate('from', 'name username email _id picture')
        .populate('to', 'name username email _id picture')
        .sort({'createdAt': 1})

        const friends = AllFriends.map((request)=>{
            if(request.from._id.toString() === user.toString()){
                return {
                    name:request.to.name,
                    email:request.to.email,
                    username:request.to.username,
                    id:request.to._id,
                    picture:request.to.picture
                }
            }
            else{
                return {
                    name:request.from.name,
                    email:request.from.email,
                    username:request.from.username,
                    id:request.from._id,
                    picture:request.from.picture
                }
            }
        })
        if(AllFriends.length > 0) res.send({
            message:"All friends fetched successfully!",
            data: friends
        })  
        else res.send({
            message: 'you don\'t have any friends yet!'
        })    
    } catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {sendRequest, viewAllRequests, acceptAndRejectRequests, viewAllFriends}





