const express = require('express')
const trimRequest = require('trim-request')
const {register, login, logout, refreshToken, editInfo, search} = require('../controllers/auth')
const { openAndCreateCoversation,  getConversations } = require('../controllers/conversation')
const { userAuth } = require('../middlewares/userAuth')
const { sendMessage, getConversationMessages } = require('../controllers/message')
const { sendRequest, viewAllRequests, acceptAndRejectRequests, viewAllFriends } = require('../controllers/request')
const { viewAllNotifications } = require('../controllers/notification')



const Router = express.Router()

Router.post('/register', trimRequest.all, register)
Router.post('/login', trimRequest.all, login)
Router.post('/logout', trimRequest.all, logout)
Router.patch('/edit', trimRequest.all, userAuth, editInfo)
Router.post('/refreshtoken', trimRequest.all, refreshToken)

Router.get('/search', trimRequest.all, userAuth, search)

Router.post('/conversation', trimRequest.all, userAuth, openAndCreateCoversation)
Router.get('/conversations', trimRequest.all, userAuth, getConversations)

Router.post('/send/message', trimRequest.all, userAuth, sendMessage)
Router.get('/conversation/:convoId', trimRequest.all, userAuth, getConversationMessages)

Router.get('/requests', trimRequest.all, userAuth, viewAllRequests )
Router.post('/request/send/:id', trimRequest.all, userAuth, sendRequest)
Router.post('/requests/:status/:id', trimRequest.all, userAuth, acceptAndRejectRequests)
Router.get('/notifications', trimRequest.all, userAuth, viewAllNotifications)
Router.get('/friends', trimRequest.all, userAuth, viewAllFriends)

// todo ----> 
Router.patch('/notifications/seen/:id', trimRequest.all, userAuth, )

module.exports = Router


