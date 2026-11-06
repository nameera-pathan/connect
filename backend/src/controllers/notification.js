const Request = require('../models/request')
const User = require('../models/user')
const Notification = require('../models/notification')

const viewAllNotifications = async (req, res) =>{
    try{
        const user = req.user
    //    / console.log("user ----> ", req.user)
        const notifications = await Notification.find({to:user.id})
        .sort({'createdAt': -1}).select('to seen message')
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


module.exports = {viewAllNotifications}
