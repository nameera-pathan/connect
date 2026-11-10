import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AttachmentIcon, CallIcon, CameraIcon, CloseIcon, DocumentIcon, 
    DotsIcon, EmojiIcon, PhotoIcon, 
    SearchLargeIcon, SendIcon, TraingleIcon,
    VideoCallIcon
     } from '../assets'
import IMAGE from '../assets/images/DOCX.png'   
import { addFiles, clearFiles, removeFileFromFiles, getConversationMessagesThunk, sendMessageThunk, updateMessagesAction } from '../controller/ChatReducer'
import { GetReceiver, MomentDate, uploadFiles } from '../hooks'
import { BounceLoader, CircleLoader, ClipLoader, DotLoader, PulseLoader } from 'react-spinners'
import EmojiPicker from 'emoji-picker-react'
import SocketContext from '../context'
import VideoThumbnail from 'react-video-thumbnail'
import DownloadIcon from '../assets/DownloadIcon'

export default function DisplayMessages({onlineUsers, isTyping, callUser, setCall ,call}) {
    const dispatch = useDispatch()
    const socket = useContext(SocketContext)
    const {user} = useSelector(state => state.user)
    const {activeConversation, messages, status, files} = useSelector(state => state.chat)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showAttachmentOptions, setshowAttachmentOptions] = useState(false)
    const [online, setOnline] = useState('')
    const [inputFocused, setInputFocused] = useState(false)
    const [fileMsgInput, setFileMsgInput] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    // const [sendMessage, setSendMessage] = useState('')

    const textRef = useRef()
    const endRef = useRef()
    const inputMediaFilesRef = useRef()
    const inputDocFilesRef = useRef()
    const inputAddFilesAfterRef = useRef(null)

    const token = user.token

    const handleMessageChange = (e) =>{
        setMessage(e.target.value)
        if(e.target.value.length > 0){
            socket.emit('typing', activeConversation._id)
        }
        else{
            socket.emit('not typing', activeConversation._id)
        }
    }   

    const sendMessageHandler = async (e) => {
        e.preventDefault()
        setMessage('')
        setShowEmojiPicker(false)
        setLoading(true)
        // if(!message) return
        let currentMessage = await dispatch(sendMessageThunk({textmessage:message, conversationId: activeConversation._id, files:[], token:token}))
        await socket.emit('send message', currentMessage.payload.data)
        setLoading(false)
    }

    const sendMessageAndFile = async (e) =>{
        e.preventDefault()
        setFileMsgInput('')
        setLoading(true)
        // upload files
        const uploadedFiles = await uploadFiles(files)
        // console.log(uploadedFiles)
        // send message
        const values = {
            textmessage: fileMsgInput,
            files: uploadedFiles.length > 0 ? uploadedFiles : [] ,
            conversationId: activeConversation._id,
            token: token
        }
        await dispatch(clearFiles()) 
        let currentMessage = await dispatch(sendMessageThunk(values))  
        await socket.emit('send message', currentMessage.payload.data)
        setshowAttachmentOptions((state)=>!state)
        setLoading(false)
    }

    const handleRemoveFile = async (index) => {
        await dispatch(removeFileFromFiles(index))
        let filesLength = await files.length > 0
        if(filesLength) { await setActiveIndex(0) }
        else await setshowAttachmentOptions((state)=>!state)
    }

    const handleEmoji = (emojiData, e) =>{
        const {emoji} = emojiData
        const inputElement = textRef.current
        inputElement.focus()
        const start = message.substring(0, inputElement.selectionStart)
        const end = message.substring(inputElement.selectionStart)
        const text = start+emoji+end
        setMessage(text)
    }

    const scrollToBottom = () => {
        endRef.current.scrollIntoView({behavior:'smooth'})
    }

    const triggerInputMediaFiles = () =>{
        inputMediaFilesRef.current.click()
    }

    const triggerInputDocFiles = () =>{
        inputDocFilesRef.current.click()
    }

    const clearFilesHandler = () =>{
        dispatch(clearFiles())
    }

    const mediaFilesOnChange = (e) =>{
        const files = Array.from(e.target.files)
        files.forEach((file)=>{
            if( file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/gif' &&
                file.type !== 'image/bmp' &&
                file.type !== 'image/webp' &&
                file.type !== 'image/tiff' &&
                file.type !== 'video/mp4' &&
                file.type !== 'video/avi' &&
                file.type !== 'video/webm' &&
                file.type !== 'video/mpeg' &&
                file.type !== 'video/quicktime' &&
                file.type !== 'video/x-msvideo' &&
                file.type !== 'video/3gpp' &&
                file.type !== 'video/3gpp2' &&
                file.type !== 'video/x-ms-wmv' &&
                file.type !== 'video/x-ms-asf' &&
                file.type !== 'video/x-flv' &&
                file.type !== 'video/x-matroska' &&
                file.type !== 'video/x-msvideo' &&
                file.type !== 'video/x-ms-wmv'
            ){
                // filter files
                files = files.filter((item)=> item.name !== file.name)
                alert('Only image and video files are allowed')
                return;
            }else if(file.size > 1024*1024*30){
                // filter files
                files = files.filter((item)=> item.name !== file.name)
                alert(`Maximum 10 mb image size is allowed.`)
                return;
            }else{
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (e) => {
                    dispatch(addFiles({
                        file,
                        fileBase64: e.target.result,
                        type: file.type.split('/')[0],
                    }))
                }
            }
        })  
        // console.log(files)
    }

    const docFilesOnChange = (e) =>{
        const files = Array.from(e.target.files)
        files.forEach((file)=>{
            if( file.type !== 'application/jpeg' &&
                file.type !== 'application/pdf' &&
                file.type !== 'application/msword' &&
                file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                file.type !== 'application/vnd.ms-excel' &&
                file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                file.type !== 'application/vnd.ms-powerpoint' &&
                file.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
                file.type !== 'application/vnd.oasis.opendocument.text' &&
                file.type !== 'application/vnd.oasis.opendocument.spreadsheet' &&
                file.type !== 'application/vnd.oasis.opendocument.presentation' &&
                file.type !== 'application/x-abiword' &&
                file.type !== 'application/x-freearc' &&
                file.type !== 'application/rtf' &&
                file.type !== 'application/vnd.rar' &&
                file.type !== 'application/zip' &&
                file.type !== 'text/plain' &&
                file.type !== 'text/csv' &&
                file.type !== 'audio/aac' &&
                file.type !== 'audio/mpeg' &&
                file.type !== 'audio/mpeg3' &&
                file.type !== 'audio/mpeg4' &&
                file.type !== 'audio/wav' &&
                file.type !== 'audio/webm' &&
                file.type !== 'audio/midi' &&
                file.type !== 'audio/x-midi'
            ){
                // filter files
                alert('Only image and video files are allowed')
            }else if(file.size > 1024*1024*30){
                // filter files
                alert(`Maximum 10 mb image size is allowed.`)
            }else{
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (e) => {
                    dispatch(addFiles({
                        file,
                        fileBase64: e.target.result,
                        type: file.type.split('/')[0],
                    }))
                }
            }
        })  
        console.log(files)
    }

    const allFilesOnChange = (e) => {
        const files = Array.from(e.target.files)
        files.forEach((file)=>{
            if( file.type !== 'application/jpeg' &&
                file.type !== 'application/pdf' &&
                file.type !== 'application/msword' &&
                file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                file.type !== 'application/vnd.ms-excel' &&
                file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                file.type !== 'application/vnd.ms-powerpoint' &&
                file.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
                file.type !== 'application/vnd.oasis.opendocument.text' &&
                file.type !== 'application/vnd.oasis.opendocument.spreadsheet' &&
                file.type !== 'application/vnd.oasis.opendocument.presentation' &&
                file.type !== 'application/x-abiword' &&
                file.type !== 'application/x-freearc' &&
                file.type !== 'application/rtf' &&
                file.type !== 'application/vnd.rar' &&
                file.type !== 'application/zip' &&
                file.type !== 'text/plain' &&
                file.type !== 'text/csv' &&
                file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/gif' &&
                file.type !== 'image/bmp' &&
                file.type !== 'image/webp' &&
                file.type !== 'image/tiff' &&
                file.type !== 'video/mp4' &&
                file.type !== 'video/avi' &&
                file.type !== 'video/webm' &&
                file.type !== 'video/mpeg' &&
                file.type !== 'video/quicktime' &&
                file.type !== 'video/x-msvideo' &&
                file.type !== 'video/3gpp' &&
                file.type !== 'video/3gpp2' &&
                file.type !== 'video/x-ms-wmv' &&
                file.type !== 'video/x-ms-asf' &&
                file.type !== 'video/x-flv' &&
                file.type !== 'video/x-matroska' &&
                file.type !== 'video/x-msvideo' &&
                file.type !== 'video/x-ms-wmv'
            ){
                // filter files
                alert('Only image, video and application files are allowed')
            }else if(file.size > 1024*1024*30){
                // filter files
                alert(`Maximum 10 mb image size is allowed.`)
            }else{
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (e) => {
                    // console.log('type: ',file.type.split('/')[0])
                    const type = file.type.split('/')[0]
                    dispatch(addFiles({
                        file,
                        fileBase64: type === 'image' || type === 'IMAGE' ? e.target.result : '',
                        type: type,
                    }))
                }
            }
        })  
    }

    useEffect(()=>{
        scrollToBottom()
    },[messages, isTyping])

    useEffect(()=>{
        if(activeConversation._id){
            dispatch(getConversationMessagesThunk({id:activeConversation._id, token:token}))
            let isOnline = onlineUsers.find((u)=>u.userId === GetReceiver(user.id, activeConversation.members))
            if(isOnline){
                setOnline('online')
            }
            else{
                setOnline('offline')
            }
        }
    },[activeConversation])

    useEffect(()=>{
        if(inputFocused && message.length > 0){
            socket.emit('typing', activeConversation._id)
        }
        else{
            socket.emit('not typing', activeConversation._id)
        }
    },[inputFocused])

    // console.log('file type: ', files[activeIndex]? files[activeIndex].type : '')
    return (
        <section className='relative w-full h-full border-1 border-1-dark_border_2 select-none overflow-hidden'>
            <div>

                {/* chat header */}
                <div className="bg-dark_bg_2 flex items-center select-none h-[49px] px-4">
                    <div className="w-full flex items-center justify-between">
                        {/* left */}
                        <div className="flex items-center gap-x-4">
                            <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1">
                                <img src={activeConversation.picture} alt="" className='w-full h-full rounded-full object-cover'/>        
                            </button>
                            <div className="flex flex-col">
                                <h1 className="text-white text-sm font-bold">
                                    {
                                        !activeConversation.isGroup ?
                                        (activeConversation.members[0]._id === user.id ? activeConversation.members[1].name : activeConversation.members[0].name) 
                                        : activeConversation.name    
                                    }
                                     &nbsp; .&nbsp;
                                    @{
                                        !activeConversation.isGroup ?
                                        (activeConversation.members[0]._id === user.id ? activeConversation.members[1].username : activeConversation.members[0].username) 
                                        : activeConversation.username    
                                    }                                    
                                </h1>
                                <span className="text-xs text-dark_svg_2">{activeConversation.isGroup ? '' : online}</span>
                            </div>
                        </div>
                        {/* right */}
                        <ul className="flex items-center gap-x-2 ">
                            {1 == 1 
                            ? (<li onClick={()=>callUser()}>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"> 
                                        <VideoCallIcon className='dark:fill-dark_svg_1'/> 
                                    </button>
                                </li>)
                            : null }
                            {1 == 1 
                            ? (<li>
                                <button className="w-[25px] h-[25px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"> 
                                        <CallIcon className='dark:fill-dark_svg_1'/> 
                                    </button>
                                </li>)
                            : null }
                            <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"> 
                                    <SearchLargeIcon className='dark:fill-dark_svg_1'/> 
                                </button>
                            </li>
                            <li>
                                <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"> 
                                    <DotsIcon className='dark:fill-dark_svg_1'/> 
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* show (files) if files true else (messages and chatAction) */}
                {
                    files.length > 0 
                    ? 
                    // FilesPreview component
                    <div className='relative py-2 w-full flex items-center justify-center'>
                        <div className='h-full w-full flex flex-col items-center border-red'>
                                {/* FilesPreview header */}
                                <div className='w-full'>
                                    <div className="w-full flex items-center justify-between">
                                        <div className="translate-x-4 cursor-pointer" onClick={clearFilesHandler}>
                                            <CloseIcon />
                                        </div>
                                        {/* file name */}
                                        <h1 className="text-dark_text_1 text-[15px]">
                                            {files[activeIndex]?.file?.name}
                                        </h1>
                                        {/* empty tag */}
                                        <span></span>
                                    </div>
                                </div>

                                {/* FilesViewer (display selected files) */}
                                <div className=' w-full max-w-[60%] h-full'>
                                    <div className="flex justify-center items-center">
                                    { files?.[activeIndex] && files[activeIndex]?.type === 'image' 
                                        ? ( <img src={files[activeIndex].fileBase64} alt=""
                                            className='pt-[px] pb-[8px] max-w-[80%] object-contain h-[calc(100vh-280px)]' />)
                                        : files?.[activeIndex]?.type === 'video' 
                                        ? (<video src={files[activeIndex].fileBase64} controls> </video>)
                                        : ( <div className="min-w-full flex flex-col items-center justify-center h-[calc(100vh-280px)]">
                                            <img src={IMAGE} 
                                            alt="" className='object-contain w-[60px] h-[70px]' />
                                            <h1 className="text-dark_text_2 text-2xl">
                                                No Preview Available
                                            </h1>
                                            <span className="text-dark_text_2">
                                                {files?.[activeIndex]?.file?.size} KB - {files?.[activeIndex]?.type}
                                            </span>
                                        </div> )
                                    }
                                    </div>
                                </div>

                            

                                {/* message input and send button */}
                                <div className='w-full max-w-[60%] h-full flex flex-col items-center'>
                                    {/* message input (files) */}
                                    <div className="w-full dark:bg-dark_hover_1 rounded-lg">
                                        <input type="text" placegolder="type a message" 
                                        value={fileMsgInput} onChange={(e)=> setFileMsgInput(e.target.value)}
                                        placeholder='type a messsage'
                                        className='mt-1 w-full bg-transparent h-8 pl-2 focus:outline-none 
                                        border-none text-dark_text_1 min-w-[60%]'/>
                                        {/* w-[60%] h-2 p-4 */}
                                    </div>
                                    {/* send and manipulate files */}
                                    <div className='w-[97%] flex items-center justify-between mt-2 border-t border-dark_border_2'>
                                        <div className="flex gap-x-2">
                                            {   files.map((file, i)=>(
                                                <div key={i} 
                                                onClick={()=>
                                                    {setActiveIndex(i)} }
                                                className={`fileThumbnail relative w-14 h-14 border mt-2 border-white rounded-md overflow-hidden cursor-pointer
                                                          ${activeIndex === i ? 'border-[3px]' : ''} `}>
                                                    {
                                                        file.type === 'image' 
                                                        ? <img src={file.fileBase64} className='w-full h-full object-cover'/>
                                                        : file.type === 'video' 
                                                        ? <VideoThumbnail videoUrl={file.fileBase64} />
                                                        : <img src={IMAGE} className='w-8 h-10 mt-1.5 ml-2.5' />
                                                    }
                                                    
                                                    <div className='removeFileIcon hidden' 
                                                    onClick={()=>handleRemoveFile(i)}> 
                                                        <CloseIcon className='fill-white absolute right-0 top-0 h-4 w-4' />
                                                    </div>
                                                </div>
                                            ))}
                                            {/* add another file */}
                                            <div className='w-14 h-14 mt-2 border border-white rounded-md flex items-center justify-center cursor-pointer'
                                             onClick={()=>inputAddFilesAfterRef.current.click()}
                                             >
                                                <span className="rotate-45">
                                                    <CloseIcon className='fill-dark_svg_1'/>
                                                </span>    
                                                <input
                                                    type="file"
                                                    accept="application/*,text/plain,image/*,video/*"
                                                    hidden
                                                    multiple
                                                    ref={inputAddFilesAfterRef}
                                                    onChange={(e)=>{allFilesOnChange(e)}}
                                                />
                                            </div>
                                        </div>
                                        {/* send button */}
                                        <div className="w-16 h-16 mt-2 rounded-full flex items-center justify-center cursor-pointer"
                                        onClick={(e)=>sendMessageAndFile(e)}>

                                        {  loading ? (<CircleLoader color='#fff' size={30}/>) : (
                                            <SendIcon className='dark:fill-dark_svg_1' />
                                        )}

                                        </div>
                                    </div>
                                </div>

                        </div>
                    </div>

                    : (<>
                    {/* messages */}
                        <div className="mb-[60px] bg-zinc-950">
                            <div className="scrollbar overflow-scrollbar py-2 px-[5%]">
                                { messages.map((msg)=>{
                                    // console.log("msg ----> ",msg)
                                    return(
                                       <div key={msg._id}> 
                                       {/* message files */}
                                 
                                            {
                                              msg.mediaFiles.length > 0 
                                            ? msg.mediaFiles.map((file, i)=> (
                                                <div key={i} className={`w-full flex mt-2 space-x-3 max-w-xs  
                                                    ${user.id === msg.sender._id ? 'ml-auto justify-end' : ''} `}   >
                                                        <div className={`relative min-w-20 h-full text-dark_text_1 p-1 rounded-lg
                                                            ${ user.id === msg.sender._id
                                                                ? 'border-[1px] pb-6' : 'bg-dark_bg_2 pb-6'} `}>
                                                            {user.id !== msg.sender._id ? (  <div className='absolute top-0 left-[-39px]'>
                                                                <img src={msg.sender.picture} alt="" className='w-8 h-8 rounded-full' />
                                                            </div>) : null}        
                                                            <div className=" h-full text-white">{
                                                                file.type === 'image'
                                                                ? (<img src={file.file.secure_url} className='cursor-pointer rounded-md'/>)
                                                                : file.type === 'video' 
                                                                ? (<video src={file.file.secure_url} controls></video>)
                                                                : (<div className='p-1'>
                                                                        <div className="flex justify-between gap-x-8">
                                                                            <div className="flex items-center gap-2.5">
                                                                                <img src={IMAGE} className='w-8 object-contain'/>
                                                                                <div className="flex flex-col gap-2">
                                                                                    <h1>{file.file.original_filename}.{file.file.public_id.split('.')[1]}</h1>
                                                                                    <span className="text-sm">{file.file.bytes}B</span>
                                                                                </div>
                                                                            </div>
                                                                            <a href={file.file.secure_url} target='_blank' download>
                                                                                <DownloadIcon className='fill-white'/>
                                                                            </a>
                                                                        </div>
                                                                    </div>) 
                                                                }</div>
                                                            <span className="absolute right-1.5 bottom-1.5 text-xs leading-none text-dark_text_5">
                                                                {MomentDate(msg.createdAt)}
                                                            </span>
                                                            {
                                                            user.id !== msg.sender._id
                                                            ? (<span>
                                                                    <TraingleIcon className='dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5' />
                                                                </span>)
                                                            : null
                                                            }
                                                        </div>
                                                    </div>
                                            )) 
                                            : null }
                                            
                                       {/* message text */}
                                            { msg.message.length > 0 ?
                                                (<div className={`w-full flex mt-2 space-x-3 max-w-xs  
                                                    ${user.id === msg.sender._id ? 'ml-auto justify-end' : ''} `}   >
                                                       <div className='relative flex mt-2'>
                                                        {user.id !== msg.sender._id ? (  <div className='absolute top-0 left-[-39px]'>
                                                                <img src={msg.sender.picture} alt="" className='w-8 h-8 rounded-full' />
                                                            </div>) : null}
                                                          
                                                            <div className={`relative min-w-20 h-full-text-dark_text_1 p-2 rounded-lg
                                                                ${ user.id === msg.sender._id ? 'bg-indigo-700' : 'bg-dark_bg_2'}`}>
                                                                <p className="float-left h-full text-sm text-white pb-5">{msg.message}</p>
                                                                <span className="absolute right-1.5 bottom-1.5 text-xs leading-none text-dark_text_5">
                                                                    {MomentDate(msg.createdAt)}
                                                                </span>
                                                                {
                                                                user.id !== msg.sender._id
                                                                ? (<span>
                                                                        <TraingleIcon className='dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5' />
                                                                    </span>)
                                                                : null
                                                                }
                                                            </div>
                                                       </div>
                                                    </div>)
                                            : null }
                                        </div>
                                    )
                                })}
                                <div className='mt-2 text-xs text-white flex tracking-wide relative w-[65px]' ref={endRef}>
                                    {isTyping === activeConversation._id
                                    ? (<><span>Typing</span> 
                                        <span className='absolute bottom-0 right-0'>
                                            <PulseLoader size={3.5} color='#fff' margin={2} speedMultiplier={0.7}/>
                                            </span>
                                        </>) 
                                    : ''}
                                </div>
                            </div>
                        </div>

                    {/* chatAction (send message input div) */}
                        <form className="flex items-center absolute bottom-0 py-2 px-4 select-none w-full bg-dark_bg_2 h-[70px] border"
                        onSubmit={(e)=>{sendMessageHandler(e)}}
                        >
                            <div className="w-full flex items-center gap-x-2">
                                <ul className="flex gap-x-2">
                                    {/* emoji button */}
                                    <li className=''>
                                        <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1" type='button'
                                        onClick={()=>{
                                            setShowEmojiPicker((state)=>!state)
                                            setshowAttachmentOptions(false)
                                        }}
                                        >
                                            { showEmojiPicker ? <CloseIcon className='dark:fill-dark_svg_1'/> :  <EmojiIcon className='dark:fill-dark_svg_1' /> }
                                        
                                        </button>
                                        {
                                        showEmojiPicker
                                        ? (    
                                        <div className=" w-full absolute bottom-[60px] left-[-0.5px] openEmojiAnimation">
                                            <EmojiPicker theme='dark' lazyLoad={false} onEmojiClick={handleEmoji}/>
                                        </div>
                                        )
                                        : null
                                        }
                                    </li>

                                    {/* attachment button */}
                                    <li className='relative'>
                                        <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-dark_hover_1" type='button'
                                        onClick={()=>{
                                            setshowAttachmentOptions((state)=>!state)
                                            setShowEmojiPicker(false)
                                        }}
                                        >
                                            <AttachmentIcon className='dark:fill-dark_svg_1' />
                                        </button>
                                        {
                                            showAttachmentOptions 
                                            ? (
                                                <ul className="absolute bottom-14 openEmojiAnimation">
                                                    <li>
                                                        <button className='bg-indigo-500 hover:bg-indigo-600 rounded-full'
                                                        type='button' onClick={triggerInputDocFiles}>
                                                            <DocumentIcon />
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept="application/*,text/*,audio/*"
                                                            hidden
                                                            multiple
                                                            ref={inputDocFilesRef}
                                                            onChange={(e)=>{docFilesOnChange(e)}}
                                                        />
                                                    </li>
                                                    <li>
                                                        <button className='bg-rose-500 hover:bg-rose-600 rounded-full' type='button'>
                                                            <CameraIcon />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className='bg-fuchsia-500 hover:bg-fuchsia-600 rounded-full' 
                                                        type='button' onClick={triggerInputMediaFiles}
                                                        > 
                                                            <PhotoIcon />
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept="image/*,video/*"
                                                            hidden
                                                            multiple
                                                            ref={inputMediaFilesRef}
                                                            onChange={(e)=>{mediaFilesOnChange(e)}}
                                                        />
                                                    </li>
                                                </ul>
                                            )
                                            :
                                            null
                                        }
                                        
                                    </li>
                                </ul>

                                {/* input */}
                                <div className="w-full">
                                    <input type="text" className="w-full bg-dark_hover_1 pl-4 text-dark_text_1 outline-none h-[45px] flex-1 rounded-lg"
                                    placeholder='Type a message'
                                    onChange={(e)=>{handleMessageChange(e)}}
                                    spellCheck='false'
                                    value={message}
                                    ref={textRef}
                                    onFocus={()=>{setInputFocused(true)}}
                                    onBlur={()=>{setInputFocused(false)}}
                                    />
                                </div>
                                {/* send button */}
                                { status==='loading' && loading ? <CircleLoader color='#fff' size={30}/>: (
                                    <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center hover:bg-dark_hover_1" type='submit'>
                                        <SendIcon className='dark:fill-dark_svg_1' />
                                    </button>
                                ) }
                                
                            </div>  
                        </form>    
                    </>)
                }


            </div>
        </section>
    )
}






