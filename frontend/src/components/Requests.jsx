// import {useEffect, useState} from 'react'
import { ReturnIcon } from '../assets'
import { useDispatch, useSelector } from 'react-redux'
// import { ValidIcon, CloseIcon } from '../assets'

export default function Requests({setShowRequests, setShowSearchAndConvo}) {

    const requests = useSelector((state)=>state.user.requests)
    // console.log("req comp - ",requests)

    const handleReturn = () =>{
        setShowRequests(false)
        setShowSearchAndConvo(true)
    }  
    

    return (
        <section className="h-full">
            <button onClick={()=>handleReturn()} className='mt-2 ml-3'> 
                 <ReturnIcon className='dark:fill-blue-300 w-5' /> 
            </button>

            {
                requests && requests.map((request)=>{
                    return(           
                    <li className='text-white list-none h-[72px] w-full bg-dar_bg_1'
                         key={request._id}>
                             <div className=" border-b border-b-dark_border_1"></div>
                            <div className="relative w-full flex items-center justify-between py-[10px]">
                                {/* left */}
                                <div className="flex items-center gap-x-1 px-[10px] w-full">
                                    <div className="relative rounded-full overflow-hidden h-[45px] min-w-[45px] max-w-[45px]">
                                        <img src={request.from.picture} alt="" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <h3 className=" flex items-center gap-x-2">{request.from.name}</h3>
                                        <div>
                                            <div className="flex items-center gap-x-1 text-dark_text_2">
                                                <div className="flex-1 items-center gap-x-1 text-dark_text_2 text-sm">
                                                    <p>{`@${request.from.username}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     <button className="w-[100px] h-[30px] rounded-md px-[10px]
                                      flex items-center justify-center 
                                      text-green-500 hover:text-white
                                      hover:bg-green-800 text-sm border border-green-800"
                                        onClick={()=>{}}>
                                        Accept
                                        {/* <ValidIcon className='dark:fill-dark_svg_1' /> */}
                                    </button>                                    
                                    <button className="w-[80px] h-[30px] rounded-md px-[10px]
                                    text-sm flex items-center justify-center 
                                    text-red-500 hover:text-white
                                    hover:bg-red-800
                                    border border-red-800"
                                        onClick={()=>{}}>
                                       Delete  
                                        {/* <CloseIcon className='dark:fill-dark_svg_1' /> */}
                                    </button>

                                </div>
                                {/* right */}
                                {/* <div className="flex flex-col gap-y-4 items-end text-xs">
                                    <span className="text-dark_text_2">{useMoment(conversation.latestMessage?.createdAt)}</span>
                                </div> */}
                            </div>
                            <div className="border-b border-b-dark_border_1"></div>
                        </li>)
                })
            }

            { requests && requests.length > 0
                ?   null 
                :   <div className='h-[65%] flex justify-center items-center text-sm text-slate-400'>     
                        You don't have any requests yet.
                    </div> 
            }
        </section>
    )
}





