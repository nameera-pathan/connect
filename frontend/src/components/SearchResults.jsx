// import {useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveConversationThunk } from '../controller/ChatReducer'
import { sendRequestThunk } from '../controller/UserReducer'
import {AddContactIcon, ChatIcon} from "../assets"

// import SocketContext from '../context'

export default function SearchResults({searchResults, setSearchResults, inputRef, setShow}) {
    // const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user);
    const token = user.token
    const getConversation = async (receiverId) => {
        console.log("clicked")
        await dispatch(getActiveConversationThunk({receiverId: receiverId, convoId:false, token: token}))
        setSearchResults([])
        inputRef.current.value = ''
        setShow(false)
    }

    const handleSendRequest = async (userId) =>{
        // console.log('id - ', userId)
        let values = {userId}
        await dispatch(sendRequestThunk(values))
    }

    return (
        <section className='convos scrollbar'>
            <ul>
            {
                searchResults && searchResults.map((user)=>{
                    return(
                        <li className='text-white list-none h-[72px] w-full bg-dar_bg_1 hover:bg-dark_bg_2'
                         key={user._id}>
                            <div className="relative w-full flex items-center justify-between py-[10px]">
                                {/* left */}
                                <div className="flex items-center gap-x-1 px-[10px]">
                                    <div className="relative rounded-full overflow-hidden h-[45px] min-w-[45px] max-w-[45px]">
                                        <img src={user.picture} alt="" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <h3 className=" flex items-center gap-x-2">{user.name}</h3>
                                        <div>
                                            <div className="flex items-center gap-x-1 text-dark_text_2">
                                                <div className="flex-1 items-center gap-x-1 text-dark_text_2 text-sm">
                                                    <p>{`@${user.username}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     <button className="w-[100px] h-[50px] rounded-full flex items-center justify-center hover:bg-dark_hover_1 "
                                        onClick={()=>{getConversation(user._id)}}>
                                        <ChatIcon className='dark:fill-dark_svg_1' />
                                    </button>                                    
                                    <button className="w-[100px] h-[50px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"
                                        onClick={()=>{handleSendRequest(user._id)}}>
                                        <AddContactIcon className='dark:fill-dark_svg_1' />
                                    </button>

                                </div>
                                {/* right */}
                                {/* <div className="flex flex-col gap-y-4 items-end text-xs">
                                    <span className="text-dark_text_2">{useMoment(conversation.latestMessage?.createdAt)}</span>
                                </div> */}
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



