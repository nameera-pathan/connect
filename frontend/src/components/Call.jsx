import React, { useState, useEffect } from 'react'
import { CloseIcon, CallIcon, ArrowIcon, LockIcon, AddContactIcon,
     ValidIcon, SpeakerIcon, VideoDialIcon, MuteIcon, DialIcon } from '../assets'
// import AUDIO from '../audio/ringtone.mp3'
import { capitalize } from '../hooks'
import { useSelector } from 'react-redux'


export default function Call({call, setCall, 
    callAccepted, myVideo, answerCall,
    show, userVideo, stream, endCall,
    totalSecInCall, setTotalSecInCall, remoteStream}) {

    const {receivingCall, callEnded} = call
    const [timer, setTimer] = useState(0)
    const [showActions, setShowActions] = useState(false)
    const [toggle, setToggle] = useState(false)
    const {user} = useSelector(state => state.user)

    const {activeConversation} = useSelector(state => state.chat)
    // console.log(activeConversation, user)    

    useEffect(() => {
        if (userVideo.current && remoteStream) {
            userVideo.current.srcObject = remoteStream;
        }
    }, [remoteStream, callAccepted]);


    useEffect(() => {
        if (myVideo.current && stream && show && !callEnded) {
            myVideo.current.srcObject = stream;

            myVideo.current.play().catch(err => {
                console.log("Local video play error:", err);
            });
        }
    }, [stream, show, callEnded]);

    useEffect(() => {
        if (!receivingCall || callAccepted) {
            setTimer(0);
            return;
        }

        // Reset timer for every new incoming call
        setTimer(0);

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev >= 15) {
                    setCall(current => ({
                        ...current,
                        receivingCall: false
                    }));

                    clearInterval(interval);
                    return prev;
                }

                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, [receivingCall, callAccepted, setCall]);

    useEffect(() => {
        if (!callAccepted) {
            setTotalSecInCall(0);
            return;
        }

        const interval = setInterval(() => {
            setTotalSecInCall(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [callAccepted, setTotalSecInCall]);

    return (
        <>
        <section className={`border-[5px] w-[350px] h-[550px] border-white 
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-2xl overflow-hidden bgCall
        ${receivingCall && !callAccepted  ? 'hidden' : ''}`}
        onMouseOver={()=>setShowActions(true)}
        onMouseOut={()=>setShowActions(false)}>
        
        {/* container */}
        <div>
            <div>
                {/* header */}
                <header className='absolute top-0 w-full z-40'>
                    {/* header container */}
                    { totalSecInCall > 0 ? <>
                    <div className="p-1 flex items-center justify-between">
                        <div className="flex items-center px-[10px] bg-slate-500 rounded-md text-white">
                                {/* call times */}
                                <div className={`${totalSecInCall > 0 ? 'block' : 'hidden'}`}>
                                    {Math.floor(totalSecInCall / 3600) > 0 && (
                                        <>
                                            <span>
                                                {String(Math.floor(totalSecInCall / 3600)).padStart(2, '0')}
                                            </span>
                                            <span> : </span>
                                        </>
                                    )}
                                    <span>
                                        {String(Math.floor((totalSecInCall % 3600) / 60)).padStart(2, '0')}
                                    </span>
                                    <span> : </span>
                                    <span>
                                        {String(totalSecInCall % 60).padStart(2, '0')}
                                    </span>
                                </div>
                        </div>
                        <div  className="flex items-center px-[10px] bg-slate-500 rounded-md text-white">
                            { 
                                (Object.keys(activeConversation).length !== 0) ?
                                    activeConversation.members[0]._id === user.id ? `@${activeConversation.members[1].username}` : `@${activeConversation.members[0].username}`
                                : null    
                            }
                        </div>
                    </div> 
                    </> : null}
                </header>

                {/* call area */}
                <div className="absolute top-12 z-40 w-full p-1">
                    <div className="flex flex-col items-center">
                        {/* call infos */}
                        <div className="flex items-center flex-col gap-y-1">
                           { totalSecInCall === 0 
                           ? (<>
                                <h1 className='text-white text-lg'>
                                    <b>{user.name ? capitalize(user.name) : null}</b>
                                </h1>
                                <span className="text-dark_text_1">Ringing...</span>
                            </>)
                           : null } 

                        </div>
                    </div>
                </div>

                {/* call Actions */}
                {showActions ? (
                    <div className="h-22 w-full absolute bottom-0 z-40 px-1">
                       {/*Container*/}
                       <div className="relative bg-[#222] px-4 pt-6 pb-12 rounded-xl">
                           {/*Expand icon*/}
                           <button className="-rotate-90 scale-y-[300%] absolute top-1 left-1/2">
                           <ArrowIcon className="fill-dark_svg_2" />
                           </button>
                           {/*Actions*/}
                           <ul className="flex items-center justify-between">
                           <li>
                               <button className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark_bg_2">
                               <SpeakerIcon className="fill-white w-6" />
                               </button>
                           </li>
                           <li>
                               <button className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark_bg_2">
                               <VideoDialIcon className="fill-white w-14 mt-2.5" />
                               </button>
                           </li>
                           <li>
                               <button className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark_bg_2">
                               <MuteIcon className="fill-white w-5" />
                               </button>
                           </li>
                           <li onClick={endCall}>
                               <button className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark_bg_2 bg-red-600 rotate-[135deg]">
                               <DialIcon className="fill-white w-6" />
                               </button>
                           </li>
                           </ul>
                       </div>
                    </div>
                ) : null}
            </div>


            {/* video streams */}
            <div>
                {/* remote video (other person) */}
                {callAccepted && !callEnded ? (
                    <video
                        ref={userVideo}
                        playsInline
                        autoPlay
                        className={
                            toggle
                                ? 'absolute top-0 bottom-0 left-0 right-0 z-20 object-cover h-full cursor-pointer'
                                : 'w-28 h-32 object-cover absolute bottom-4 right-2 z-30 rounded-lg'
                        }
                        onClick={() => setToggle(prev => !prev)}
                    />) : null
                }

                {/* myVideo (your own video) */}
                {/* {console.log(stream)} */}
                {stream && (
                    <div>
                        <video
                            ref={myVideo}
                            playsInline
                            muted
                            autoPlay
                            className={`
                                ${toggle
                                    ? 'w-28 h-32 object-cover absolute bottom-4 right-2 z-30 bg-blue-500 cursor-pointer rounded-lg'
                                    : 'absolute top-0 bottom-0 left-0 right-0 z-20 object-cover h-full bg-red-400 cursor-pointer'
                                }
                                ${showActions ? 'moveVideoCall' : ''}
                            `}
                            onClick={() => setToggle(prev => !prev)}
                        />
                    </div>
                )}
            </div>

        </div>
        </section>

          {/* Ringing BOX */}
          {receivingCall && !callAccepted &&
            (<><div className='bg-dark_bg_1 w-[350px] shadow-lg rounded_lg
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'>
                {/* container */}
                <div className="p-4 flex items-center justify-between gap-x-8 ">
                    {/* call infos */}
                    <div className="flex items-center gap-x-2 ">
                        <img src={call.picture ? call.picture : null}
                        className='w-20 h-20 rounded-full'/>
                        <div>
                            <h1 className='text-white'>
                                <b>{call.name}</b>
                            </h1>
                            <span className="text-dark_text_2">whatsapp video call...</span>
                    </div>
                    </div>
                    {/* call actions */}
                    <ul className="flex items-center gap-x-2">
                        <li onClick={endCall}>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500">
                                <CloseIcon className='fill-white w-5'/>
                            </button>
                        </li>
                        <li onClick={answerCall}>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500">
                                <ValidIcon className='fill-white w-6 mt-2 '/>
                            </button>
                        </li>
                    </ul>
                </div>
            </div></>)}
        
        {/* ringing audio */}
            {
            !callAccepted && show 
                ? ( <audio src='../../../audio/ringing.mp3' autoPlay loop></audio> ) 
                : null
            }   
    </> )
}







