const Request = require('../models/request')
const User = require('../models/user')
const Notification = require('../models/notification')

const sendRequest = async (req, res) =>{
    try {
        const from = req.user._id
        const to = req.params.id
        const status = "pending"
        if(from.toString() === to.toString()) throw new Error('cannot send request to yourself!')
        const userExist = await User.findById({ _id:to })
        if(!userExist) throw new Error('User not found!')
        const requestExist = await Request.findOne({
            $or:[{ from, to }, { from: to, to:from }]
        })
        .populate('from', 'name hash username email _id')
        .populate('to', 'name hash username email _id')
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
            .populate('from', 'name hash username email _id')
            .populate('to', 'name hash username email _id')
            const notify = new Notification({ 
                to,
                message:`${request.from.username} \#${request.from.hash} wants to be your friend.` 
            })
            await notify.save()
            res.send({
                message: "Friend request sent successfully!",
                data:request
            })
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const viewAllRequests = async (req, res) =>{
    try {
        const to = req.user._id
        const status = "pending"
        const requests = await Request.find({
            to,
            status
        })
        .populate('from', 'name hash username email _id')
        if(requests.length < 1) return res.send({
            message: 'No friend requests yet!',
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
        const user = req.user
        const { status, id } = req.params
        const allowedStatus = ['accept', 'reject']
        if(!allowedStatus.includes(status)) throw new Error('Invalid status!')
        const requestIdExist = await Request.findById(id)    
        if(!requestIdExist) throw new Error('Friend request ID not found!')

        const request = await Request.findOne({ _id:id, to:user._id , status:'pending' }) 
        if(!request) throw new Error('Friend request not found!')  

        if(status === 'accept') {
            request.status = 'connected'
            const data = await request.save()
            const loggedInUser = await User.findOne({ hash: user.hash });
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
                message:`${user.username} \#${user.hash} and you are now friends!`
            })
            await notify.save()
            res.send({
                message: `you and ${request.from} are now friends!`,
                you: loggedInUserFriends,
                other: connectedUserFriends,
                data,
            })
        }
        else{
            const data = await Request.deleteOne({_id:id})
            res.send(data)
        }
    }catch(err){
        res.status(400).send(err.message)
    }
}

const viewAllFriends = async (req, res) =>{
    try{
        const user = req.user
        const AllFriends = await Request.find({
            $or: [
                { to: user._id, status: 'connected' },
                { from: user._id, status: 'connected' }
            ]
        })
        .populate('from', 'name hash username _id picture')
        .populate('to', 'name hash username _id picture')
        .sort({'createdAt': 1})

        const friends = AllFriends.map((request)=>{
            if(request.from._id.toString() === user._id.toString()){
                return {
                    name:request.to.name,
                    hash:request.to.hash,
                    username:request.to.username,
                    id:request.to._id,
                    picture:request.to.picture
                }
            }
            else{
                return {
                    name:request.from.name,
                    hash:request.from.hash,
                    username:request.from.username,
                    id:request.from._id,
                    picture:request.from.picture
                }
            }
        })
        if(AllFriends.length > 0) res.send({
            data: friends
        })  
        else res.send({
            message: 'No friends yet!'
        })    
    } catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {sendRequest, viewAllRequests, acceptAndRejectRequests, viewAllFriends}





