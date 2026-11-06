import React, { useState } from 'react'
import { ReturnIcon, ValidIcon } from '../assets'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { createGroupConversationThunk } from '../controller/ChatReducer'

export default function CreateGroup({ setShowCreateGroup }) {

    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.user)
    const {status} = useSelector((state) => state.chat)

    const [name, setName] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    const token = user.token

    const handleSearch = async (e) =>{
        setSearchResults([])
        if(e.target.value && e.key == 'Enter'){
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/search?q=${e.target.value}`,  {
                    headers: {Authorization: `Bearer ${token}`}
                })
                if(response.data.data.length > 0){
                    let tempArr = []
                    response.data.data.forEach((usr)=>{
                        let temp = {
                            value: usr._id,
                            label:usr.name,
                            picture:usr.picture
                        }
                        tempArr.push(temp)
                    })
                    setSearchResults(tempArr)
                }
                else setSearchResults([])
            } catch (err) {
                console.log(err.response.data)
            }
        }
        else{
            setSearchResults([])
        }
    }

    const createGroupHandle = async () =>{
        if(status !=='loading'){
            let users= []
            selectedUsers.forEach((usr)=>{
                users.push(usr.value)
            })
            let values = {
                name, users, token
            }
            let conversation = await dispatch(createGroupConversationThunk(values))
        }
    }

    return (
        <section className='createGroupAnimation relative flex0030 h-full z-40'>
            <div className='mt-5'>

                {/* return close button */}
                <div className='cursor-pointer w-6 h-6 border rounded-full'
                onClick={()=>setShowCreateGroup(false)}>
                    <ReturnIcon className='fill-white' />
                </div>

                {/* group name input (underline input) */}
                <div className='mt-4'>
                    <input type="text" placeholder='Name'
                    value={name} onChange={(e)=> setName(e.target.value)}
                    className='w-full bg-transparent border-b border-green_1
                    text-dark_text_1 outline-none pl-1'/>
                </div>

                {/* multiple select */}
                <div className='mt-4'>
                    <Select 
                    options={searchResults} 
                    onChange={setSelectedUsers}
                    onKeyDown={(e) => handleSearch(e)}
                    placeholder='Search users, select' 
                    isMulti
                    styles={{
                        control: (baseStyles, state)=>({
                            ...baseStyles,
                            border :'none',
                            outline: 'none',
                            borderColor: 'transparent',
                            background: 'transparent',
                            boxShadow: 'none',
                            cursor:'pointer'
                        }),
                        // option:((base, { data, isDisabled, isFocused, isSelected }) => {
                        //     return {
                        //       ...base,
                        //       backgroundColor: isFocused ? "red" : "blue",
                        //     };
                        //   })
                        
                    }}
                    formatOptionLabel={(user)=>(
                        <div className='flex items-center gap-1'>
                            <img src={user.picture} alt="" className='w-8 h-8 object-cover rounded-full'/>
                            <span className='text-[#222]'>{user.label}</span>    
                        </div>)}
                    />
                </div>

                {/* create group button  */}
                 <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 ">
                    <button className='btn bg-green_1 hover:bg-green-500 rounded-full '
                    onClick={()=>createGroupHandle()}>
                        {status === 'loading' 
                        ? <ClipLoader color='#E9EDEF' size={20}/> 
                        : <ValidIcon className='fill-white mt-2 h-full w-full rounded-full'/>}
                    </button>
                </div>       
            </div>
        </section>
    )
}
