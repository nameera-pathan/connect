const express = require('express')
const trimRequest = require('trim-request')
const {register, login, logout, refreshToken, editInfo, search} = require('../controllers/auth')
const { openAndCreateCoversation,  getConversations, createGroupConversation } = require('../controllers/conversation')
const { userAuth } = require('../middlewares/userAuth')
const { sendMessage, getConversationMessages } = require('../controllers/message')
const { sendRequest, viewAllRequests, acceptAndRejectRequests, viewAllFriends } = require('../controllers/request')
const { viewAllNotifications, markNotificationSeen } = require('../controllers/notification')



const Router = express.Router()

Router.post('/register', trimRequest.all, register)
Router.post('/login', trimRequest.all, login)
Router.post('/logout', trimRequest.all, logout)
Router.post('/refreshtoken', trimRequest.all, refreshToken)
Router.get('/middleware', trimRequest.all, userAuth )

Router.patch('/edit', trimRequest.all, userAuth, editInfo)
Router.get('/search', trimRequest.all, userAuth, search)

Router.post('/conversation', trimRequest.all, userAuth, openAndCreateCoversation)
Router.post('/group', trimRequest.all, userAuth, createGroupConversation)
Router.get('/conversations', trimRequest.all, userAuth, getConversations)

Router.post('/send/message', trimRequest.all, userAuth, sendMessage)
Router.get('/conversation/:convoId', trimRequest.all, userAuth, getConversationMessages)

Router.post('/send/request', trimRequest.all, userAuth, sendRequest)
Router.post('/request', trimRequest.all, userAuth, acceptAndRejectRequests)
Router.get('/requests', trimRequest.all, userAuth, viewAllRequests)
Router.get('/notifications', trimRequest.all, userAuth, viewAllNotifications)
Router.get('/friends', trimRequest.all, userAuth, viewAllFriends)

// Router.post('/follow/status', userAuth, followAndUnfollowUser)
// Router.get('/followers', trimRequest.all, userAuth, followers)
// Router.get('/following', trimRequest.all, userAuth, following)

Router.patch('/notifications/seen', trimRequest.all, userAuth, markNotificationSeen)

module.exports = Router


