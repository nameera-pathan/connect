import React, { useState } from 'react'
import { ReturnIcon, ValidIcon } from '../assets'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { createGroupConversationThunk } from '../controller/ChatReducer'
// import { useNavigate } from 'react-router-dom'

export default function CreateGroup({ setShowCreateGroup }) {

    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const {user} = useSelector((state) => state.user)
    const {status} = useSelector((state) => state.chat)

    const [name, setName] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    const token = user.token

    const handleSearch = async (e) =>{
        setSearchResults([])
        if(e.target.value && e.key === 'Enter'){
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/search?u=${e.target.value}`,  {
                    headers: {Authorization: `Bearer ${token}`}
                })
                if(response.data.data.length > 0){
                    let tempArr = []
                    response.data.data.forEach((usr)=>{
                        let temp = {
                            value: usr._id,
                            label:usr.name,
                            username_label: usr.username,
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
                name, users
            }
            // console.log(values)
            await dispatch(createGroupConversationThunk(values))
            // setShowCreateGroup(false)
            // navigate('/')
            if(status === "success"){
                setShowCreateGroup(false)
            }
            console.log(status)
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
                    <input type="text" placeholder='Group Name'
                    value={name} onChange={(e)=> setName(e.target.value)}
                    className='w-full bg-transparent border-b
                    text-dark_text_1 outline-none pl-1'/>
                </div>

                {/* multiple select */}
                <div className='mt-4 border-[1px]'>
                    <Select
                        options={searchResults}
                        onChange={setSelectedUsers}
                        onKeyDown={(e) => handleSearch(e)}
                        placeholder='Search users, select'
                        isMulti
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: 'none',
                                outline: 'none',
                                color: 'white',
                                borderColor: 'transparent',
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'transparent'
                                }
                            }),

                            placeholder: (base) => ({
                                ...base,
                                color: '#9ca3af'
                            }),

                            input: (base) => ({
                                ...base,
                                color: 'white'
                            }),

                            singleValue: (base) => ({
                                ...base,
                                color: 'white'
                            }),

                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: '#374151',
                                borderRadius: '6px'
                            }),

                            multiValueLabel: (base) => ({
                                ...base,
                                color: 'white'
                            }),

                            multiValueRemove: (base) => ({
                                ...base,
                                color: 'white',
                                ':hover': {
                                    backgroundColor: '#374151',
                                    color: 'white',
                                    borderRadius:'7px'
                                }
                            }),

                            menu: (base) => ({
                                ...base,
                                backgroundColor: '#1f2937'
                            }),

                            option: (base, { isFocused, isSelected }) => ({
                                ...base,
                                backgroundColor: isSelected
                                    ? '#2563eb'
                                    : isFocused
                                    ? '#374151'
                                    : '#1f2937',
                                color: 'white',
                                cursor: 'pointer',
                                ':active': {
                                    backgroundColor: '#2563eb'
                                }
                            })
                        }}
                        formatOptionLabel={(user) => (
                            <div className='flex items-center gap-1'>
                                <img
                                    src={user.picture}
                                    alt=""
                                    className='w-8 h-8 object-cover rounded-full'
                                />
                                <span className='flex items-center justify-center gap-1'>
                                {/* <span className='text-white'>{user.label}</span> */}
                                <span className='text-white'>{`@${user.username_label}`}</span>
                                </span>
                            </div>
                        )}
                    />
                </div>

                {/* create group button  */}
                 <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 ">
                    <button className='btn bg-blue_1 hover:bg-blue-500 rounded-full '
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
