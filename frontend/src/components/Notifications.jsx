import React from 'react'
import { ReturnIcon } from '../assets'
import { useDispatch, useSelector } from 'react-redux'
import { ValidIcon, CloseIcon } from '../assets'
import { MomentDate } from '../hooks'

export default function Notifications({setShowNotifications, setShowSearchAndConvo}) {

  const notifications = useSelector((state)=>state.user.notifications)

  const handleReturn = () =>{
    setShowNotifications(false)
    setShowSearchAndConvo(true)
  }
  return (
    <section className='h-full'>
            <button onClick={()=>handleReturn()} className='mt-2 ml-3'> 
                 <ReturnIcon className='dark:fill-blue-300 w-5' /> 
            </button>

            {
                notifications && notifications.map((notification)=>{
                    return(           
                    <li className='text-white list-none h-[65px] w-full bg-dar_bg_1 border-b border-t border-t-dark_border_1 border-b-dark_border_1'
                         key={notification._id}>
                                <div className="relative  h-full w-full flex items-center justify-between px-[10px]">
                                    {/* left */}
                                    <div className="flex items-center gap-x-5 px-[10px] h-full w-full">
                                        <div className="w-full flex flex-col">
                                            <span className="text-sm flex items-center gap-x-2">{notification.message}</span>
                                        </div>                               
                                        {/* <button className="w-[100px] h-[50px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"
                                            onClick={()=>{}}>
                                            <CloseIcon className='dark:fill-dark_svg_1' />
                                        </button> */}
                                        <div className="flex flex-col gap-y-4 items-end text-xs">
                                        <span className="text-dark_text_2">{MomentDate(notification.createdAt)}</span>
                                        </div>
                                    </div>
                                    {/* right */}
                            
                                </div>
                        </li>)
                })
            }

            { notifications && notifications.length > 0
                ?   null 
                : <div className='h-[65%] flex justify-center items-center text-sm text-slate-400'>    
                    You don't have any notifications.
                  </div> 
            }
    </section>
  )
}








