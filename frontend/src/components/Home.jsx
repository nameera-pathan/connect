import { useState, useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import SideBar from "./SideBar"
import { getConversationThunk, updateMessagesAction } from "../controller/ChatReducer"
import { getRequestsThunk, getNotificationsThunk, updateRequestsAction, updateNotificationsAction } from "../controller/UserReducer"
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
    const [remoteStream, setRemoteStream] = useState(null);

    const myVideo = useRef(null)
    const userVideo = useRef(null)
    const connectionRef = useRef(null)
    const pendingCallAcceptedRef = useRef(null);
    

    // console.log("req comp - ",requests)

    useEffect(()=>{
      const getResponse = async () =>{
        let resRequests = await dispatch(getRequestsThunk())
        let resNotifications = await dispatch(getNotificationsThunk())
        // console.log(resRequests.payload)
        if(resRequests.payload) await dispatch(updateRequestsAction(resRequests.payload))
        if(resNotifications.payload) await dispatch(updateNotificationsAction(resNotifications.payload))
        // console.log("notifications" ,resNotifications.payload)
      }
      getResponse()
    },[user])

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


    useEffect(() => {
        setupMedia();

        const handleSetupSocket = (id) => {
            setCall(prev => ({ ...prev, socketId: id }));
        };

        const handleCallUser = (data) => {
            setCallAccepted(false);
            setRemoteStream(null);
            setShow(false);

            setCall(prev => ({
                ...prev,
                socketId: data.from,
                name: data.name,
                picture: data.picture,
                signal: data.signal,
                receivingCall: true,
                callEnded: false
            }));
        };

        const handleCallEnded = () => {
            setShow(false);

            // Remove old call accepted listener
            if (pendingCallAcceptedRef.current) {
                socket.off('call accepted', pendingCallAcceptedRef.current);
                pendingCallAcceptedRef.current = null;
            }

            setCall(prev => ({
                ...prev,
                callEnded: true,
                receivingCall: false,
                signal: null
            }));

            // Clear video streams
            if (myVideo.current) myVideo.current.srcObject = null;
            if (userVideo.current) userVideo.current.srcObject = null;

            setRemoteStream(null);
            setCallAccepted(false);
            setTotalSecInCall(0);

            // Destroy old peer
            if (connectionRef.current) {
                connectionRef.current.destroy();
                connectionRef.current = null;
            }
        };

            socket.on('setup socket', handleSetupSocket);
            socket.on('call user', handleCallUser);
            socket.on('call ended', handleCallEnded);

            return () => {
                socket.off('setup socket', handleSetupSocket);
                socket.off('call user', handleCallUser);
                socket.off('call ended', handleCallEnded);
            };
    }, [socket]);

    const setupMedia = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            // console.log("Camera stream:", mediaStream);
            // console.log("Video tracks:", mediaStream.getVideoTracks());
            // console.log("Video track enabled:", mediaStream.getVideoTracks()[0]?.enabled);

            setStream(mediaStream);
        } catch (error) {
            console.error("Camera access error:", error);
        }
    };

    const callUser = () => {
        if (!stream) {
            console.log('Camera and microphone are not ready yet');
            return;
        }
        if (activeConversation.hasOwnProperty('members')) {
            setShow(true);
            setCall(prev => ({
                ...prev,
                name: getConversationName(user, activeConversation.members),
                picture: getConversationPicture(user, activeConversation.members),
                callEnded: false
            }));

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream
            });

            peer.on('signal', (data) => {
                socket.emit('call user', {
                    userToCall: getConversationId(user, activeConversation.members),
                    signal: data,
                    from: socket.id,
                    name: user.name,
                    picture: user.picture
                });
            });

            peer.on('stream', (remote) => {
                setRemoteStream(remote);
            });

            peer.on('error', (err) => {
                console.error('Caller peer error:', err);
            });

            const handleCallAccepted = (signal) => {
            // Ignore responses belonging to an old or destroyed peer
            if (
                connectionRef.current !== peer ||
                peer.destroyed
            ) {
                return;
            }
                setCallAccepted(true);
                peer.signal(signal);
            };
            pendingCallAcceptedRef.current = handleCallAccepted;
            socket.on('call accepted', handleCallAccepted);

            connectionRef.current = peer;
        }
    };


    const answerCall = () => {
        if (!stream) {
            console.log('Camera and microphone are not ready yet');
            return;
        }
        setCallAccepted(true);
        setShow(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        peer.on('signal', (data) => {
            socket.emit('answer call', {
                signal: data,
                to: call.socketId
            });
        });

        peer.on('stream', (remote) => {
            setRemoteStream(remote);
        });

        peer.on('error', (err) => {
            console.error('Receiver peer error:', err);
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const endCall = () => {
        setShow(false);

        // Remove pending call accepted listener
        if (pendingCallAcceptedRef.current) {
            socket.off('call accepted', pendingCallAcceptedRef.current);
            pendingCallAcceptedRef.current = null;
        }

        // Notify the other user
        if (call.socketId) {
            socket.emit('call ended', call.socketId);
        }

        setCall(prev => ({
            ...prev,
            callEnded: true,
            receivingCall: false,
            signal: null
        }));

        // Clear video streams
        if (myVideo.current) {
            myVideo.current.srcObject = null;
        }

        if (userVideo.current) {
            userVideo.current.srcObject = null;
        }

        setRemoteStream(null);
        setCallAccepted(false);
        setTotalSecInCall(0);

        // Destroy current peer
        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
    };

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
            <Call
              call={call}
              setCall={setCall}
              callAccepted={callAccepted}
              myVideo={myVideo}
              userVideo={userVideo}
              stream={stream}
              remoteStream={remoteStream}
              show={show}
              answerCall={answerCall}
              endCall={endCall}
              totalSecInCall={totalSecInCall}
              setTotalSecInCall={setTotalSecInCall} />
          </div>      
        </section>
        
    )
}

export default Home






