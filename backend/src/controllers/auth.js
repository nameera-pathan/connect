const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Conversation = require('../models/conversation')
const User = require('../models/user')
const Message = require('../models/message')
const {validateRegistrationData, validateLogin} = require('../utils/helpers')

const register = async (req, res) => {
    try {
        // console.log(req.body)
        validateRegistrationData(req.body)
        const {name, email, password, username} = req.body
        const user = new User({ 
            name, email, 
            phonenumber: req.body.phonenumber ? req.body.phonenumber : '' ,
            password,
            username: username? username.toLowerCase() : ''
        })
        let isNew = user.isNew
        const data = await user.save()

        // access_token
        const access_token = await jwt.sign({id:data._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1d'})
        const refresh_token = await jwt.sign({id:data._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'30d'})
        res.cookie("refreshtoken", refresh_token, {
            httpOnly:true,
            path:"/api/v1/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
        })

        res.send({
            message: 'Registration successful',
            data :{
                id:data._id,
                name: data.name,
                email: data.email,
                picture: data.picture,
                status: data.status,
                token: access_token,
                phonenumber: data.phonenumber,
                password: data.password,
                username: data.username,
                friends: data.friends,
                followers: data.followers,
                following: data.following,
                tag: data.tag,
                bio: data.bio,
                isNew: isNew
            }
        })
    } catch (err) {
        if (err.errorResponse && err.errorResponse.keyPattern.email === 1){
            res.status(403).send('Email already exist!')
        }else if(err.errorResponse && err.errorResponse.keyPattern.username === 1){
            res.status(403).send('username already exist... use different tagname or tag!')
        }
        else res.status(400).send(err.message) 
    }
}



const login = async (req, res) => {
    try {
        validateLogin(req.body)
        const {email, password, username, text} = req.body
        let user
        // console.log("includes --------->", text.includes("@"))
        if(email){ user = await User.findOne({email}) }
        if(username){ user = await User.findOne({username})  }
        if(!user) throw new Error('User not found!')
        console.log('user ----------------->',user)    
        const isPasswordValid = await bcrypt.compare(password, user.password.toString())
        console.log("valid ----> ", isPasswordValid)
        if(!isPasswordValid) throw new Error('Invalid credentials!')

        // access_token
        const access_token = await jwt.sign({id:user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1d'})
        const refresh_token = await jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'30d'})
        res.cookie("refreshtoken", refresh_token, {
            httpOnly:true,
            path:"/api/v1/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
        })

        res.send({
            message: 'Login successful',
            data: {
                id:user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
                token: access_token,
                phonenumber: user.phonenumber,
                username:user.username,
                friends:user.friends,
                password:user.password,
                followers: user.followers,
                following: user.following,
                tags: user.tags,
                bio: user.bio,
            }
        })
    } catch (error) {
        res.status(400).send(error.message) 
    }
}

const editInfo = async (req, res) => {
    try {
        const {picture, status} = req.body
        const user = await User.findOne({_id:req.user._id})
        if(picture !== '') user.picture = picture
        if(status !== '') user.status = status
        await user.save()
        res.send({
            message: 'Info updated successfully',
            data: {
                id:user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
                phonenumber: user.phonenumber,
                username:user.username,
                password:user.password
            }
        })
    } catch (err) {
        res.status(400).send(err.message) 
    }
}

const search = async (req, res) =>{
    try {
        const keyword = req.query.q
        const username = req.query.u
        let message
        if(!keyword && !username) throw new Error('provide a search query first')
        let users    

        if(username){
            message = 'username'
            users = await User.find({
                $text:{
                    $search:username
                }
            })
            .sort({updatedAt:-1}).select('-password')
            .find({
                _id:{ $ne:req.user._id }
            })  
        } 
        else if(keyword){
            message = 'keyword'
            console.log('keyword')
            users = await User.find({
                $or:[
                    {name:{$regex:keyword, $options:'i'}},
                    {username:{$regex:keyword, $options:'i'}},
                ]
            })
            .sort({updatedAt:-1}).select('-password')
            .find({
                _id:{ $ne:req.user._id }
            })  
        }   
        res.send({
            message,
            data:users
        })
    } catch (err) {
        res.status(400).send(err.message) 
    }
}



const logout = async (req, res) =>{
    try{
        res.clearCookie("refreshtoken", { path: "api/v1/refreshtoken"})
        res.send(`logged out!`)
    } catch(err){
        res.status(400).send(err.message)
    }
}

const refreshToken = async (req, res) => {
    try {
        const refresh_token = req.cookies.refreshtoken
        if(!refresh_token) res.send("please login!!!")
        const decoded_obj = await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById({_id: decoded_obj.id})
        if(!user) throw new Error('User not found!')
        const access_token = await jwt.sign({id:user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1d'})
        res.send({
            message: 'Login successful',
            data: {
                id:user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
                token: access_token,
                phonenumber: user.phonenumber,
                username:user.username,
                friends:user.friends,
            }
        })                  
         

    } catch (error) {
        res.status(400).send('badrequest') 
    }
}

module.exports = {register, login, logout, refreshToken, editInfo, search}




