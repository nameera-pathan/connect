const mongoose = require('mongoose')

const connectDB = async () =>{
    // if(process.env.Node_ENV !== 'production') mongoose.set('debug', true)
    await mongoose.connect(process.env.DATABSE_URL)
}

module.exports = connectDB




