const Request = require('../models/request')
const User = require('../models/user')
const Notification = require('../models/notification')

const viewAllNotifications = async (req, res) =>{
    try{
        const user = req.user.id
        const notifications = await Notification.find({to:user})
        .sort({'createdAt': -1}).select('to seen message')
        if(notifications.length > 0) res.send({
            message: "notifications fetched successfully!", 
            data: notifications
        })  
        else return res.send({
            message: 'you don\'t have any notifications yet!',
            data: null
        })    
    } catch(err){
        res.status(400).send(err.message)
    }
} 

const markNotificationSeen = async (req, res) =>{
    try{
        const user = req.user.id
        const notificationId = req.body.notificationId
        const notifications = await Notification.find({_id:notificationId, to:user})

        if(notifications.length > 0) res.send({
            data: notifications
        })  
        else return res.send({
            message: 'No notifications found'
        })    
        res.send({user})
    } catch(err){
        res.status(400).send(err.message)
    }
} 




module.exports = {viewAllNotifications, markNotificationSeen}
