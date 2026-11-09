import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import {DotsIcon, StoryIcon, NotificationIcon,
    AddContactIcon, ArrowIcon, AttachmentIcon, CallIcon, CameraIcon, 
    ChatIcon, CloseIcon, CommunityIcon, ContactIcon, DialIcon, DocumentIcon,
    EmojiIcon, FilterIcon, LockIcon, Logo, MuteIcon, NoVideoIcon,
      PhotoIcon, PollIcon, ReturnIcon, SearchIcon, SearchLargeIcon,
      SeenIcon, SendIcon, SmallArrowIcon, SpeakerIcon, StickerIcon,
       TraingleIcon, ValidIcon, VideoCallIcon, VideoDialIcon
} from "../assets"
import Notifications from "./Notifications"
import Search from "./Search"
import Conversations from "./Conversations"
import SearchResults from "./SearchResults"
import SidebarMenu from "./SidebarMenu"
import CreateGroup from "./CreateGroup"
import Requests from "./Requests"
export default function SideBar({onlineUsers, isTyping}) {
    const {user} = useSelector((state)=>state.user)
    const [searchResults, setSearchResults] = useState([])
    const [showDotsMenu, setShowDotsMenu] = useState(false)
    const inputRef = useRef()
    const [show, setShow] = useState()
    const [showCreateGroup, setShowCreateGroup] = useState(false)
    const [showRequests, setShowRequests] = useState(false)
    const [showSearchAndConvo, setShowSearchAndConvo] = useState(true)
    const [showNotifications, setShowNotifications] = useState(false)
    const navigate = useNavigate()
    
    const handleShowRequest = () =>{
        setShowRequests(true)
        setShowNotifications(false)
        setShowSearchAndConvo(false)
    }
    const handleShowNotifications = () =>{
        setShowNotifications(true)
        setShowRequests(false)
        setShowSearchAndConvo(false)
    }

    return (
        <>
        <section className="h-full select-none w-[40%]  border-r-[6px]">
                    <div className="h-[70px] bg-dark_bg_2 flex items-center p-[16px]">
                        <div className="w-full flex justify-between items-center ">

                            {/* profile image, username and name */}
                            <div className="flex items-center gap-x-2">
                                <button type="btn" className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                                onClick={()=>{navigate('/edit')}}>
                                <img src={user.picture} alt="logo" className="w-[40px] h-[40px] rounded-full object-cover"/>
                                </button>
                                <span>
                                    <span className="test-sm">{user.name}</span> <br/>
                                    <span className="text-sm">{`@${user.username}`}</span>
                                </span>
                            </div>

                            <ul className="flex items-center gap-x-2 5">
                                <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"
                                onClick={()=>handleShowNotifications()}>
                                    <NotificationIcon className='dark:fill-dark_svg_1' />
                                </button>
                                </li>
                                <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"
                                onClick={()=>handleShowRequest()}>
                                    <AddContactIcon className='dark:fill-dark_svg_1' />
                                </button>
                                </li>
                                <li className="relative" onClick={()=>{setShowDotsMenu((state)=>!state) }}>
                                <button className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${showDotsMenu? 'bg-dark_hover_1' : 'bg-dark_bg_2'} hover:bg-dark_hover_1`}>
                                    <DotsIcon className='dark:fill-dark_svg_1' />
                                </button>
                                {showDotsMenu ? <SidebarMenu setShowCreateGroup={setShowCreateGroup}/> : null}
                                </li>
                            </ul>
                        </div>
                    </div>

                {/* profile values */}
                    <div className="flex justify-end dark:bg-dark_bg_2">
                        <div className='h-[50px] dark:bg-dark_bg_2 flex items-center justify-center p-[13px] gap-x-10 text-xs w-[94%]'>
                                <span className="">{`friends ${user.friends}`}</span>
                                <span className="">{`followers ${user.followers}`}</span>
                                <span className="">{`following ${user.following}`}</span>
                        </div>
                    </div>

                {/* border bottom */}
                    <div className="border-b"></div>


                {/* CREATE GROUP  */}
                { showCreateGroup && <CreateGroup setShowCreateGroup={setShowCreateGroup} /> }

                {/* Notifications */}
                { showNotifications && (<Notifications setShowNotifications={setShowNotifications} setShowSearchAndConvo={setShowSearchAndConvo}/>)}

                {/* Requests */}
                { showRequests && (<Requests setShowRequests={setShowRequests} setShowSearchAndConvo={setShowSearchAndConvo} /> ) }

                {/* Search and Conversations */}
                { showSearchAndConvo  &&  <>  <Search searchLength={searchResults.length}  
                        setSearchResults={setSearchResults} 
                        inputRef={inputRef}
                        show={show}
                        setShow={setShow}
                        />
                        {
                            searchResults.length > 0 
                            ? <SearchResults searchResults={searchResults} 
                                setSearchResults={setSearchResults} 
                                inputRef={inputRef}
                                setShow={setShow}
                                />
                            : <Conversations onlineUsers={onlineUsers} isTyping={isTyping}/>
                        }
                    </>   } 


        </section>
        </>
    )
}






