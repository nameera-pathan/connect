const User = require('../models/user')
const Follow = require('../models/follower')
const NotificationMessage = require('../models/notificationMessage')

const followAndUnfollowUser = async (req, res) =>{
    try{
        const follower = req.user.id
        let username //change username to id
        const { status, id } = req.body
        const allowedStatus = ['follow', 'unfollow']
        if(!allowedStatus.includes(status)) throw new Error('Invalid status!')
        if(follower === username) throw new Error('cannot follow or unfollow yourself!')
        const followingUser = await User.findOne({username:username}) 
        if(!followingUser) throw new Error('User not found!')  
        const user = await User.findOne({username:follower})    
        const followedDoc = await Follow.findOne({
            follower,
            following:followingUser.username,
            status:'followed'
        })   
        if(status === 'follow'){
            if(followedDoc) throw new Error(`You already follow ${followingUser.username}`) 
            const follow = new Follow({
                follower,
                following:followingUser.username,
                status:'followed'
            })
            const data = await follow.save()
            // user.following = user.following+1
            user.following = await Follow.countDocuments({follower:user.username, status:'followed'})
            // followingUser.followers = followingUser.followers+1
            followingUser.followers = await Follow.countDocuments({following:followingUser.username, status:'followed'})
            await user.save()
            await followingUser.save()
            const notify = new NotificationMessage({
                toUser:followingUser.username,
                seen:0,
                message:`${follower} followed you.`
            })
            await notify.save()
            res.send({
                message: `You are now following ${followingUser.username}`,
                [user.username+' following']: user.following,
                [followingUser.username+' followers']: followingUser.followers,
                data,
                notify
            }) 
        } else {
            if(!followedDoc) throw new Error(`followed doc does not exist!`) 
            const data = await Follow.deleteOne(followedDoc)
            // user.following = user.following-1
            user.following = await Follow.countDocuments({follower:user.username, status:'followed'})
            // followingUser.followers = followingUser.followers-1
            followingUser.followers = await Follow.countDocuments({following:followingUser.username, status:'followed'}) 
            await user.save()
            await followingUser.save()
            res.send({
                message: `You unfollowed ${followingUser.username}`,
                [user.username+' following']: user.following,
                [followingUser.username+' followers']: followingUser.followers,
                data
            }) 
        }     
    }catch(err){
        res.status(400).send(err.message)
    }
}

const followers = async (req, res) =>{
    try {
        const user = req.user
        const followers = await Follow.find({following:user.username, status:'followed'}).select('follower')
        res.send(followers)
    } catch (err) {
        res.status(400).send(err.message)   
    }
}

const following = async (req, res) =>{
    try {
        const user = req.user
        const following = await Follow.find({follower:user.username, status:'followed'}).select('following')
        res.send(following)
    } catch (err) {
        res.status(400).send(err.message)   
    }
}

module.exports = {followAndUnfollowUser, followers, following}