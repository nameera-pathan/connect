import React from 'react'
import { logoutAction, logoutUserThunk } from "../controller/UserReducer"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
export default function SidebarMenu({ setShowCreateGroup }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logoutUserThunk())
        dispatch(logoutAction())
    }
    return (
        <section className='absolute right-1 z-50 bg-dark_bg_2 text-dark_text_1 shadow-md w-52 rounded-sm'>
            <ul>
                <li className='py-3 pl-5 cursor-pointer hover:bg-dark_bg_3' 
                onClick={()=>setShowCreateGroup(true)}
                >
                    <span>New group</span>
                </li>
                <li className='py-3 pl-5 cursor-pointer hover:bg-dark_bg_3' onClick={()=>{navigate('/edit')}}>
                    <span>Edit Profile</span>
                </li>
                <li className='py-3 pl-5 cursor-pointer hover:bg-dark_bg_3' onClick={handleLogout}>
                    <span>Logout</span>
                </li>
            </ul>
        </section>
    )
}
