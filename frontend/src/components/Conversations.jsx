import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetReceiver, MomentDate } from '../hooks'
import { getActiveConversationThunk } from '../controller/ChatReducer'
import SocketContext from '../context'
import { PulseLoader } from 'react-spinners'
import { logoutAction } from '../controller/UserReducer'

export default function Conversations({onlineUsers, isTyping}) {
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.user)
    const {conversations, activeConversation, status} = useSelector(state => state.chat)

    const token = user.token

    const getConversation = async (members, convoId, isGroup) => {
        let receiverId = GetReceiver(user.id, members)
        let conversation = await dispatch(getActiveConversationThunk({receiverId: receiverId, isGroup: isGroup ? convoId: false, token: token}))
        socket.emit('join conversation', conversation.payload._id)
    }

    // useEffect(()=>{
    //     if(conversations.length===0){
    //         dispatch(logoutAction())
    //     }
    // },[conversations])    

    return (
        <section className='convos scrollbar'>
            <ul>
            {
                conversations && conversations
                .filter((conversation)=>(conversation.latestMessage || conversation._id === activeConversation._id || conversation.isGroup === true))
                .map((conversation)=>{
                    let checkOnline = onlineUsers.find((u)=>u.userId === GetReceiver(user.id, conversation.members)) 
                    return(
                        <li className={`text-whit list-none h-[72px] w-full ${activeConversation._id === conversation._id ? 'bg-violet-600' : 'bg-dark_bg_1'}  hover:bg-dark_bg_2 cursor-pointer px-[10px]`} 
                        key={conversation._id} onClick={()=>{getConversation(conversation.members, conversation._id, conversation.isGroup)}}>
                            <div className="relative w-full flex items-center justify-between py-[10px]">
                                {/* left */}
                                <div className="flex items-center gap-x-3">
                                    <div className={`relative z-0 overflow-hidden h-[50px] min-w-[50px] max-w-[50px]
                                       ${ checkOnline 
                                       ? 'before:absolute before:z-50 before:bg-green-500 before:h-[12px] before:w-[12px] before:rounded-full before:right-0.5 before:bottom-0.5' 
                                       : '' } `}>
                                        <img src={conversation.picture} alt="" 
                                        className={`w-full h-full object-cover rounded-full`}/>
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <h1 className={`font-bold flex items-center gap-x-2 ${activeConversation._id === conversation._id ? 'text-white' : '' } `}>
                                            {!conversation.isGroup 
                                            ? conversation.members[0]._id === user.id ? conversation.members[1].name : conversation.members[0].name 
                                            : conversation.name }
                                        </h1>
                                        <div>
                                            <div className="flex items-center gap-x-1 ">
                                                <div className="flex-1 items-center gap-x-1 ">
                                                    
                                                {isTyping === conversation._id 
                                                ?   <p className='text-xs text-white flex tracking-wide relative w-[65px]'>
                                                    <><span>Typing</span> 
                                                        <span className='absolute bottom-0 right-0'>
                                                            <PulseLoader size={3.5} color='#fff' margin={2} speedMultiplier={0.7}/>
                                                            </span>
                                                        </> 
                                                    </p>
                                                
                                                :   <p className={`${activeConversation._id === conversation._id ? 'text-white' : ''}`}>
                                                    {
                                                        conversation?.latestMessage?.message.length > 25 
                                                        ? `${conversation?.latestMessage?.message.substring(0, 25)}...`
                                                        : conversation?.latestMessage?.message
                                                    }
                                                    </p>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* right */}
                                <div className="flex flex-col gap-y-4 items-end text-xs">
                                    {conversation.latestMessage ? <span className="text-dark_text_2">
                                        {MomentDate(conversation.latestMessage?.createdAt)}</span> : null}
                                </div>
                            </div>
                            <div className="ml-16 border-b border-b-dark_border_1"></div>
                        </li>
                    )
                })
            }
            </ul>
        </section>
    )
}







