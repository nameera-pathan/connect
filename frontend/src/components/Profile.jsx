import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {EditIcon, ReturnIcon} from "../assets"
import axios from 'axios'
import { updateUserInfoThunk } from '../controller/UserReducer'
import toast, {Toaster} from 'react-hot-toast'

const cloud_name = process.env.REACT_APP_CLOUD_NAME
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET

export default function Profile({setShowProfile}) {

    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.user)

    const [texts, setTexts] = useState({
        name:user.name,
        email:user.email,
        phonenumber:user.phonenumber,
        status:user.status,
        bio:user.bio,
        socials:{
            link1:user.socials[0].link1,
            link2:user.socials[1].link2,
            link3:user.socials[2].link3,
            link4:user.socials[3].link4
        },
        username:user.username,
        picture:user.picture
    })

    const [passwordFields, setPasswordFields] = useState({
        "current-password":"",
        "new-password":"",
        "confirm-new-password":""
    })

    // const [socials, setSocials] = useState()

    const [picture, setPicture] = useState() 
    const [readablePicture, setReadablePicture] = useState(user.picture) 
    const [uploadError, setUploadError] = useState()

    const inputRef = useRef()

    const triggerFileInput = () =>{
        inputRef.current.click()
    }

    const handleImageUploadChange = (e) =>{
        // console.log(e.target.files.length)
        if(e.target.files.length > 0) { 
            const file = e.target.files[0] 
            if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' ){
                let name = file.name.toString().split(".")[1]
                toast.error(`${name} format is invalid. Please select valid image format.`)
            }
            else if (file.size > 1024*1024*10){
                toast.error(`Maximum 10 mb image size is allowed.`)
            }
            else{
                setPicture(file)
                console.log('picture: ',file.name)

                // For reading image file.
                const reader = new FileReader()
                // reading it as data url, so i can get as base64 as data url.
                reader.readAsDataURL(file)
                // now I can use an onload event on reader... it simply gives me an event,
                // to get my base64 image from event.target.result
                reader.onload = (event) => {
                    setReadablePicture(event.target.result)    
                }
                // setUploadError(null)
            }
        }
    }

    const savechanges = async () =>{
        // UPLOAD IMAGE TO CLOUDINARY
        console.log("clicked")
        let imageToUpload
        if(picture){
            try {
                let formData = new FormData()
                formData.append('upload_preset', cloud_secret)
                formData.append('file', picture)
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
                const {data} = await axios.post(cloudinaryUrl, formData)
                imageToUpload = data.secure_url
                // console.log(data)
            } catch (err) {
                console.log(err)
            }
        }
        let values = {
                picture:imageToUpload ? imageToUpload : '',
                status: texts.status,
                token: user.token,
                bio: texts.bio,
                name: texts.name,
                username: texts.username,
                email:texts.email,
                socials:texts.socials
        }
        let res = await dispatch(updateUserInfoThunk(values))
        if(res.error.message === "Rejected") toast.error(res.payload.toString())
        else toast.success("profile edited successfully!")    
        // console.log(res)
        // console.log(texts)
        // console.log(passwordFields)
       
    }  

    const handleReturn = () =>{
        setShowProfile(false)
    }

    const handleChange = (e) =>{
        // console.log(e.target.id, e.target.value)
        let socialsArr =["link1", "link2", "link3", "link4"]
        let pwds = ["current-password", "new-password", "confirm-new-password"]
        if(pwds.includes(e.target.id)) setPasswordFields({...passwordFields, [e.target.id]: e.target.value })
        if(!socialsArr.includes(e.target.id) && !pwds.includes(e.target.id)) setTexts({...texts, [e.target.id]:e.target.value})
        else setTexts({...texts, ["socials"]:{...texts.socials, [e.target.id]: e.target.value}})    
    }

    return (
         <section className='h-full w-full bg-dark_bg_4 select-none px-5
         flex border-1-dark_border_1 border-b_green_2'>
               
        {/* Left */}
                <div className='w-[65%] h-full '>
                    <ul className='h-full w-full flex flex-col'>

                        {/* Return to homepage */}
                        <li className='mb-4 p-3'>
                            <button onClick={handleReturn}>
                                <ReturnIcon className="fill-white" />
                            </button>
                        </li>

                        {/* name */}
                        <li className='w-full px-10 mb-6 '>
                            <div className='h-[45px] w-full flex gap-x-5 items-center justify-between'>
                                <div className='w-[20%]'>
                                    <label htmlFor="name" className='text-lg'>Name</label>
                                </div>
                                <div  className='w-[80%]  h-full '>
                                    <input type="text" id='name' value={texts.name} placeholder='Name'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm'
                                    onChange={(e)=>handleChange(e)}         />
                                </div>
                            </div>
                        </li>

                        {/* Email */}
                        <li className='w-full px-10 mb-6'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                               <span className='w-[20%]'>
                                    <label htmlFor="email" className='text-lg'>Email</label>
                                </span>
                                <span  className='w-[80%]  h-full '>
                                    <input type="text" id='email' value={texts.email} placeholder='Email'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm' 
                                             onChange={(e)=>handleChange(e)}  />
                                </span>
                            </div>
                        </li>

                        {/* Username */}
                        <li className='w-full px-10 mb-6'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                               <span className='w-[20%]'>
                                    <label htmlFor="username" className='text-lg'>Username</label>
                                </span>
                                <span  className='w-[80%]  h-full '>
                                    <input type="text" id='username' value={texts.username} placeholder='Username'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm' 
                                             onChange={(e)=>handleChange(e)}  />
                                </span>
                            </div>
                        </li>
                        

                        {/* Bio */}
                        <li className='w-full px-10 mb-6'>
                            <div className='h-[100px] w-full flex gap-x-5 items-center'>
                               <span className='h-full w-[20%] pt-2'>
                                    <label htmlFor="bio" className='text-lg'>Bio</label>
                                </span>
                                <span  className='w-[80%]  h-full '>
                                    <textarea type="text" id='bio' value={texts.bio} placeholder='Bio'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] p-2 dark:bg-dark_bg_3 text-white text-sm'
                                             onChange={(e)=>handleChange(e)}   />
                                </span>
                            </div>
                        </li>

                        {/* Socials */}
                        <li className='w-full px-10 mb-2'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                               <span className='w-[20%]'>
                                    <label htmlFor="link1" className='text-lg'>Socials</label>
                                </span>
                                <span  className='w-[80%]  h-full '>
                                    <input type="text" id='link1' value={texts.socials.link1} placeholder='Link to social profile 1'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm' 
                                            onChange={(e)=>handleChange(e)} />
                                </span>
                            </div>
                        </li>
                        <li className='w-full px-10 mb-2'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                               <span className='w-[20%]'>
                                </span>
                                <span  className='w-[80%] h-full '>
                                    <input type="text" id='link2' value={texts.socials.link2} placeholder='Link to social profile 2'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm' 
                                            onChange={(e)=>handleChange(e)}/>
                                </span>
                            </div>
                        </li>
                        <li className='w-full px-10 mb-2'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                               <span className='w-[20%]'>
                                </span>
                                <span  className='w-[80%] h-full '>
                                    <input type="text" id='link3' value={texts.socials.link3} placeholder='Link to social profile 3'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm' 
                                            onChange={(e)=>handleChange(e)}/>
                                </span>
                            </div>
                        </li>
                        <li className='w-full px-10 mb-6'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                               <span className='w-[20%]'>
                                </span>
                                <span  className='w-[80%] h-full '>
                                    <input type="text" id='link4' value={texts.socials.link4} placeholder='Link to social profile 4'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-[70%] px-2 dark:bg-dark_bg_3 text-white text-sm' 
                                            onChange={(e)=>handleChange(e)}/>
                                </span>
                            </div>
                        </li>

                        {/* SAVE BUTTON */}
                        <li className='w-full px-10 mb-6'>
                            <div className='h-[45px] w-full flex gap-x-5 items-center'>
                                <span className='w-[20%]'>
                                </span>
                                <span  className='w-[80%] h-full '>
                                    <button className='h-full w-[70%] rounded-lg text-green-500
                                    hover:text-white hover:bg-green-700 border-[2px] border-green-700'
                                    onClick={savechanges} >
                                        Save
                                    </button>
                                </span>
                            </div>
                        </li>


                    </ul>
                </div>


        {/* Right */}
                {/* image */}
                <div className='w-[35%] h-full'>
                    <div className='px-8 py-13 py-[5rem] h-full flex flex-col gap-y-1'>
                        <div className='mb-4'>
                            <div className='flex gap-x-2'>
                                       <span>Picture</span>
                                       <EditIcon className="fill-white"/>
                            </div>
                            <div className='h-[230px] w-[230px] rounded-full border bg-white'>
                                    { readablePicture 
                                ?   (<div onClick={triggerFileInput} className="h-[250px] w-[250px] rounded-full cursor-pointer">
                                        <img src={readablePicture} alt=""
                                        className="h-[228.5px] w-[228px] rounded-full object-cover" />
                                    </div>)
                                :  ( <div className="h-[250px] w-[250px] rounded-full border cursor-pointer"
                                    onClick={triggerFileInput}>
                                        <img src={user.picture} alt=""
                                        className="h-[250px] w-[250px] rounded-full object-cover" />
                                    </div>) }

                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        hidden
                                        ref={inputRef}
                                        onChange={(e)=>{handleImageUploadChange(e)} }
                                    />
                            </div>   
                        </div>
                        <div className='mb-3'>
                            <span className='flex gap-x-2'>
                                <span>Status</span>
                                <EditIcon className="fill-white"/>
                            </span>
                            <span className='flex rounded-xl py-2'>  
                                <input type="text" id='status' value={texts.status} placeholder='Username'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-full px-2 py-2 dark:bg-dark_bg_3 text-white text-xs' 
                                            onChange={(e)=>handleChange(e)}/>
                            </span>
                        </div>
                        <div>
                            <span className='flex gap-x-2'>
                                <span>Change Password</span>
                            </span>
                            <span className='flex rounded-xl py-2 flex-col gap-y-2'>  
                                <input type="text" id='current-password' value={passwordFields["current-password"]} placeholder='Current Password'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-full px-2 py-2 dark:bg-dark_bg_3 text-white text-xs' 
                                            onChange={(e)=>handleChange(e)}/>
                                <input type="text" id='new-password' value={passwordFields["new-password"]} placeholder='New Password'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-full px-2 py-2 dark:bg-dark_bg_3 text-white text-xs' 
                                            onChange={(e)=>handleChange(e)}/>    
                                <input type="text" id='confirm-new-password' value={passwordFields["confirm-new-password"]} placeholder='Confirm New Password'
                                    className='border focus:outline-none focus:border-blue-400 rounded-lg 
                                            h-full w-full px-2 py-2 dark:bg-dark_bg_3 text-white text-xs' 
                                            onChange={(e)=>handleChange(e)}/>      
                                <span className='flex justify-end'>
                                          <a href='' className='text-xs underline'>forgot password</a>   
                                </span>                    
                                <button className='h-[45px]  rounded-lg text-blue-400
                                    hover:text-white hover:bg-blue-700 border-[2px] border-blue-700'
                                    onClick={savechanges} >
                                        Change Password
                                </button>                    
                            </span>
                        </div>
                     </div>
                </div>
                <Toaster/>
         </section>
    )
}




