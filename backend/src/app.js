const {Server} = require('socket.io')
const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const fileUpload = require('express-fileupload')
const Router = require('./routes/index')
const connectDB = require('./configs/database')
const SocketServer = require('./servers/socketServer')
dotenv.config()

const app = express()

app.use(cors(
    {
        origin:'http://localhost:3000',
        // origin:['http://localhost:3000', 'http://localhost:5173'],  //or whatever port your frontend is using
        credentials:true,            
    }
))

if(process.env.NODE_ENV !== 'production') app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(fileUpload({
    useTempFiles: true
}))

app.use('/api/v1', Router)

const connectToDB = async () =>{
    try {
        await connectDB()
        console.log('connection established!')
    } catch (err) {
        console.log('cannot connect to database!')
        console.log(err)
    }
}

connectToDB()

let server = app.listen(8000,()=>{
    console.log('server is running!')
})

const io = new Server(server, {
    pingTimeout:60000,
    cors:{
        origin: 'http://localhost:3000'
        // origin:['http://localhost:3000', 'http://localhost:5173'],
    }
})

io.on('connection', (socket) =>{
    console.log('socket io connected successfully!')
    SocketServer(socket, io)
})

