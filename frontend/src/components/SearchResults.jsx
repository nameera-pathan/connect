// import {useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveConversationThunk } from '../controller/ChatReducer'
// import SocketContext from '../context'

export default function SearchResults({searchResults, setSearchResults, inputRef, setShow}) {
    // const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user);
    const token = user.token
    const getConversation = async (receiverId) => {
        
        await dispatch(getActiveConversationThunk({receiverId: receiverId, token: token}))
        setSearchResults([])
        inputRef.current.value = ''
        setShow(false)
    }

    return (
        <section className='convos scrollbar'>
            <ul>
            {
                searchResults && searchResults.map((user)=>{
                    return(
                        <li className='text-whit list-none h-[72px] w-full bg-dar_bg_1 hover:bg-dark_bg_2 cursor-pointer px-[10px]' key={user._id} onClick={()=>{getConversation(user._id)}}>
                            <div className="relative w-full flex items-center justify-between py-[10px]">
                                {/* left */}
                                <div className="flex items-center gap-x-3">
                                    <div className="relative rounded-full overflow-hidden h-[50px] min-w-[50px] max-w-[50px]">
                                        <img src={user.picture} alt="" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <h1 className="font-bold flex items-center gap-x-2">{user.name}</h1>
                                        <div>
                                            <div className="flex items-center gap-x-1 text-dark_text_2">
                                                <div className="flex-1 items-center gap-x-1 text-dark_text_2">
                                                    <p>{user.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
