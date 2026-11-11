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
                    <li className='text-white list-none h-[72px] w-full bg-dar_bg_1 hover:bg-dark_bg_2'
                         key={notification._id}>
                             <div className=" border-b border-b-dark_border_1"></div>
                            <div className="relative w-full flex items-center justify-between py-[10px]">
                                {/* left */}
                                <div className="flex items-center gap-x-1 px-[10px]">
                                    <div className="w-full flex flex-col">
                                        <h3 className=" flex items-center gap-x-2">{notification.message}</h3>
                                    </div>                               
                                    <button className="w-[100px] h-[50px] rounded-full flex items-center justify-center hover:bg-dark_hover_1"
                                        onClick={()=>{}}>
                                        <CloseIcon className='dark:fill-dark_svg_1' />
                                    </button>
                                </div>
                                {/* right */}
                                {/* <div className="flex flex-col gap-y-4 items-end text-xs">
                                    <span className="text-dark_text_2">{MomentDate(notification.createdAt)}</span>
                                </div> */}
                            </div>
                            <div className="border-b border-b-dark_border_1"></div>
                        </li>)
                })
            }

            { notifications 
                ?   null 
                : <div className='h-[82.5%] flex justify-center items-center border text-sm text-slate-400'>    
                    You don't have any notifications.
                  </div> 
            }
    </section>
  )
}








