const validator = require('validator')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true, 'Please provide your email!'],
        unique:[true, 'Email address already exist!'],
        lowercase:true,
        validate:[validator.isEmail, 'Invalid email address!']
    },
    username:{
        type:String,
        unique:[true, 'username already exist!'],
    },
    phonenumber:{
        type:String
    },
    picture:{
        type:String,
        default:'https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png'
    },
    status:{
        type:String,
        default:'Hey there! I\'m using PingMe.'
    },
    password:{
        type:String,
        required:[true, 'Please provide your password!'],
        minLength:[6, 'your password should be at least more than 6 chars'],
        maxLength:[128, 'your password should be at least less than 128 chars']
    },
    friends:{
        type:Number,
        default:0
    }
},{
    collection:'users',
    timestamps:true
})

// Generate random string
// function generateHash(){
//     let str = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'
//     let hash = ''
//     for(let i=0; i<8; i++){
//         hash += str.charAt(Math.floor(Math.random() * str.length))
//     }
//     return hash
// }

UserSchema.pre('save', async function(next){
    try {
        if(this.isNew) {
            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(this.password, salt)
            this.password = hashedPassword
        }
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.index({username:'text'})

const User = new mongoose.model('User', UserSchema)
User.syncIndexes()
    .then(() => console.log('Indexes synchronized'))
    .catch(err => console.error('Index synchronization error:', err));
module.exports = User;



