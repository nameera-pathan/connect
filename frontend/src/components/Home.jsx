import { useState, useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import SideBar from "./SideBar"
import { getConversationThunk, updateMessagesAction } from "../controller/ChatReducer"
import DisplayNone from "./DisplayNone"
import DisplayMessages from "./DisplayMessages"
import SocketContext from "../context"
import Call from "./Call"
// import { use } from "react"
import { getConversationName, getConversationPicture, getConversationId } from "../hooks"
import Peer from 'simple-peer'



const Home = () => {
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const {user} = useSelector((state)=>state.user)
    const {activeConversation} = useSelector((state)=>state.chat)
    const [usersOnline, setUsersOnline] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [show, setShow] = useState(false)
    const [call, setCall] = useState({
      socketId:'',
      receivingCall: false,
      callEnded:false,
      name:'',
      picture:'',
      signal: null
    })
    const [callAccepted, setCallAccepted] = useState(false)
    const [stream, setStream] = useState()
    const [totalSecInCall, setTotalSecInCall] = useState(0)

    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(()=>{

    },[activeConversation])

    useEffect(()=>{
      if(user){
        dispatch(getConversationThunk()) 
        socket.emit('join', user.id)
        socket.on('online-users', (onlineUsers)=>{
          setUsersOnline([...onlineUsers])
        })
        // clear active conversation of old user
      }  
    },[user])

    useEffect(()=>{
      socket.on('receive message', (message) => {
        // console.log('homesocket: ', message)
        dispatch(updateMessagesAction(message))
      })
      socket.on('typing', (convoId) => setIsTyping(convoId))
      socket.on('not typing', () => setIsTyping(false))
    },[])

    useEffect(()=>{
      setupMedia()
      socket.on('setup socket', (id)=>{
        // console.log(id)
        setCall({...call, socketId:id})
      })
      socket.on('call user', (data)=>{
        setCall({
          ...call,
          socketId: data.from,
          name: data.name,
          picture: data.picture,
          signal: data.signal,
          receivingCall: true
        })
      })
      socket.on('call ended', ()=>{
        setShow(false)
        setCall({...call, callEnded: true, receivingCall:false})
        myVideo.current.srcObject = null;
        if (callAccepted) {
          console.log('useEffect: ', connectionRef.current)
          connectionRef?.current?.destroy();
        }
      })
    },[])


    const setupMedia = () => {
      navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream)=>{
        setStream(stream)
      })
    }

    const callUser = () =>{
      enableMedia()
      setShow(true)
      if(activeConversation.hasOwnProperty('members')){
        setCall({
          ...call,
          name: getConversationName(user ,activeConversation.members),
          picture: getConversationPicture(user ,activeConversation.members),
        })
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        })
        peer.on('signal', (data)=>{
          socket.emit('call user',{
            userToCall:getConversationId(user, activeConversation.members),
            signal: data,
            from: call.socketId,
            name: user.name,
            picture: user.picture
          })
        })
        peer.on('stream', (stream)=>{
          userVideo.current.srcObject = stream
        })
        socket.on('call accepted', (signal)=>{
          setCallAccepted(true)
          peer.signal(signal)
        })
        connectionRef.current = peer;
      }
    }

    const answerCall = () =>{
      enableMedia();
       setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      })
       peer.on('signal', (data)=>{
        socket.emit('answer call', {
          signal: data,  to: call.socketId,
        })
      })
       peer.on('stream',(stream)=>{
        userVideo.current.srcObject = stream
      })
       peer.signal(call.signal)
      connectionRef.current =  peer
    }

    const enableMedia = () =>{
      myVideo.current.srcObject = stream
      setShow(true)
    }

    const endCall = () =>{
       setShow(false)
       setCall({...call, callEnded: true, receivingCall:false, })
      myVideo.current.srcObject = null
      socket.emit('call ended', call.socketId)
      console.log('endCall: ', connectionRef.current)
      connectionRef?.current?.destroy();
    }

    console.log(activeConversation)
    return (
        <section className="h-screen flex justify-center items-center bg-dark_bg_1 border overflow-hidden border py-4">
          <div className="container flex border w-full h-full">

            <SideBar onlineUsers={usersOnline} isTyping={isTyping} />
            {activeConversation._id 
            //  && activeConversation.members[1]._id === user.id
            ? <DisplayMessages onlineUsers={usersOnline} isTyping={isTyping} 
            callUser={callUser} setCall={setCall} call={call}/> 
            : <DisplayNone/> }
          </div>  

          <div className={(show || call.signal) && !call.callEnded ? '' : 'hidden' }>
            <Call call={call} setCall={setCall} callAccepted={callAccepted}
            myVideo={myVideo} userVideo={userVideo} stream={stream}
            show={show} answerCall={answerCall}
            endCall={endCall} totalSecInCall={totalSecInCall} 
            setTotalSecInCall={setTotalSecInCall} />  
          </div>      
        </section>
        
    )
}

export default Home

