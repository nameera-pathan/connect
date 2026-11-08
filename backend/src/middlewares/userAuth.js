const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
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

