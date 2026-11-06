const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        // const {token} = req.cookies
        // if(!token) return res.status(401).send('unauthorized... Please login!')
        // const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)    
        // const user = await User.findById({_id: decodedToken.id})  
        // if(!user) throw new Error('User not found!')
        // req.user = user    
        // next()  

        // if(!req.headers["authorization"]) return next("unauthorized!!!")
        // const bearerToken = req.headers["authorization"] 
        // const token = bearerToken.split(" ")[1]
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload)=>{
        //     if(err){
        //         return next(res.status(400).send("unauthorized!!!!!"))
        //     }
        //     req.user = payload
        //     next()
        // })

    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }

    const token = bearerToken.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        req.user = payload;
        next();
    });

    } catch (err) {
        res.status(400).send(err.message)
    }
}
 
module.exports = {userAuth}

