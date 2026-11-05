import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../assets"
import Notification from "./Notification"
import Search from "./Search"
import Conversations from "./Conversations"
import SearchResults from "./SearchResults"
import SidebarMenu from "./SidebarMenu"
import CreateGroup from "./CreateGroup"
export default function SideBar({onlineUsers, isTyping}) {
    const {user} = useSelector((state)=>state.user)
    const [searchResults, setSearchResults] = useState([])
    const [showDotsMenu, setShowDotsMenu] = useState(false)
    const inputRef = useRef()
    const [show, setShow] = useState()
    const [showCreateGroup, setShowCreateGroup] = useState(false)
    
    return (
        <>
        <section className="h-full select-none w-[40%]  border-r-[6px]">
                    <div className="h-[50px] bg-dark_bg_2 flex items-center p-[16px]">
                        <div className="w-full flex justify-between items-center ">
                            <button type="btn" className="w-[40px] h-[40px] rounded-full flex items-center justify-center">
                            <img src={user.picture} alt="logo" className="w-[40px] h-[40px] rounded-full object-cover"/>
                            </button>
                            <ul className="flex items-center gap-x-2 5">
                                <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1">
                                    <CommunityIcon className='dark:fill-dark_svg_1' />
                                </button>
                                </li>
                                <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1">
                                    <StoryIcon className='dark:fill-dark_svg_1' />
                                </button>
                                </li>
                                <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1">
                                    <ChatIcon className='dark:fill-dark_svg_1' />
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
                {/* CREATE GROUP  */}
                 { showCreateGroup && <CreateGroup setShowCreateGroup={setShowCreateGroup}/> }

                    <Notification/>
                    <Search searchLength={searchResults.length}  
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
                </section>
        </>
    )
}






