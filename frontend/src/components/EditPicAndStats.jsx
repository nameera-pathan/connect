import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useRef } from "react"
import { changeIsNew, updateUserInfoThunk } from "../controller/UserReducer"
import { PulseLoader } from "react-spinners"
import axios from 'axios'

const cloud_name = process.env.REACT_APP_CLOUD_NAME
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET

const EditPicAndStats = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {status, error, user} = useSelector((state)=> state.user)
    const [picture, setPicture] = useState() 
    const [readablePicture, setReadablePicture] = useState(user.picture) 
    const [uploadError, setUploadError] = useState()
    const [currentStatus, setCurrentStatus] = useState(user.status)
    const inputRef = useRef()

    const token = user.token

    const triggerFileInput = () =>{
        inputRef.current.click()
    }

    const handleImageUploadChange = (e) =>{
        console.log(e.target.files.length)
        if(e.target.files.length > 0) { 
            const file = e.target.files[0] 
            if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' ){
                setUploadError(`${file.name} format is invalid. Please select valid image type.`)
            }
            else if (file.size > 1024*1024*10){
                setUploadError(`Maximum 10 mb image size is allowed.`)
            }
            else{
                setPicture(file)
                console.log('picture: ',file.name)
                // For reading image file.
                const reader = new FileReader()
                // reading it as data url, so i can get as base64 as data url.
                reader.readAsDataURL(file)
                // now i can use an onload event on reader... it simply gives me an event,
                // to get my base64 image from event.target.result
                reader.onload = (event) => {
                    setReadablePicture(event.target.result)    
                }
                setUploadError(null)
            }
        }
    }

    const handleContinueAndUpdate = async () =>{
        // NEXT TO UPLOAD IMAGE TO CLOUDINARY
        let imageToUpload
        if(picture){
            try {
                let formData = new FormData()
                formData.append('upload_preset', cloud_secret)
                formData.append('file', picture)
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
                const {data} = await axios.post(cloudinaryUrl, formData)
                imageToUpload = data.secure_url
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        }
        await dispatch(updateUserInfoThunk({
                picture:imageToUpload ? imageToUpload : '',
                status: currentStatus,
                token: token
            })
        )
        if (status === 'success') {
            navigate('/');
        }
        dispatch(changeIsNew())
    }   

    const handleSkip = () => {
        navigate('/')
    }

    return (
    <section className="flex items-center justify-center min-h-screen dark:bg-dark_bg_1 dark">
      <div className="card w-full max-w-sm shadow-lg bg-dark_bg_2 rounded-lg focus:none">
        <div className="card-body">
            {user.isNew ? <>
                <h2 className="text-xl font-bold text-slate-200 text-center tracking-wide">Let's get started</h2>
                <p className="text-center text-sm text-gray-500">By uploading your profile image</p>
                <p className="text-center text-sm text-gray-500 mb-1">and editing your status.</p>
            </>  
            :<>
            <h4 className="text-xl font-bold text-slate-200 text-center tracking-wide">Current image and status</h4>
            <p className="text-center text-md text-gray-500 mb-2">To change profile picture click on your profile picture and select your picture.</p>
            </>
            }
           
            <div className="flex flex-col items-center">
                {/* Display Picture div */}
                { readablePicture 
                ?   (<div onClick={triggerFileInput} className="h-[250px] w-[250px] rounded-full mb-3 cursor-pointer">
                        <img src={readablePicture} alt=""
                        className="h-[250px] w-[250px] rounded-full object-cover" />
                    </div>)
                :  ( <div className="h-[250px] w-[250px] rounded-full border mb-2 cursor-pointer"
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
                    // style={{ display: "none" }}
                />
                
                {uploadError ?  <p className="mt-4 text-center text-sm text-red-400 mb-2">{uploadError}</p> : null }

                {/* for user status */}
                <div className="mb-4 w-full">
                <input
                    autoComplete="off"
                    name='status'
                    type="text"
                    placeholder="Your status"
                    className="input input-bordered w-full"
                    required
                    value={currentStatus}
                    onChange={(e)=>{setCurrentStatus(e.target.value)}}
                />
                </div>
            

                {user.isNew ? 
               (<><button className="btn btn-success tracking-wide text-white w-full transition ease-in duration-200 mb-4" onClick={handleContinueAndUpdate}>
                {status === 'loading' ? <PulseLoader color='#fff' size={9} /> : 'Continue' }
                </button>

                <p className="text-center text-sm text-gray-500 mb-1">you can change it later if you want.</p>
                <button className="btn btn-primary tracking-wide text-white w-full transition ease-in duration-200" onClick={handleSkip}>
                {status === 'loading' ? <PulseLoader color='#fff' size={9} /> : 'Skip' }
                </button></>)
                :
                <><button className="btn btn-success tracking-wide text-white w-full transition ease-in duration-200 mb-4" onClick={handleContinueAndUpdate}>
                {status === 'loading' ? <PulseLoader color='#fff' size={9} /> : 'Update' }
                </button>
                <button className="btn btn-primary tracking-wide text-white w-full transition ease-in duration-200" onClick={handleSkip}>
                    Home
                </button>
                </>
                }   

                {error ?  <p className="mt-4 text-center text-sm text-red-400">{error}</p> : null }
            </div>


        </div>
      </div>
    </section>
    )
}


export default EditPicAndStats




