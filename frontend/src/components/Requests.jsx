// import {useEffect, useState} from 'react'
import { ReturnIcon } from '../assets'
// import { useDispatch, useSelector } from 'react-redux'

export default function Requests({setShowRequests, setShowSearchAndConvo}) {

    const handleReturn = () =>{
        setShowRequests(false)
        setShowSearchAndConvo(true)
    }  

    return (
        <section className="h-full">
            <button onClick={()=>handleReturn()} className='fixed z-10'> 
                 <ReturnIcon className='dark:fill-blue-300 w-5' /> 
            </button>

            <div className='h-[82.5%] flex justify-center items-center border text-sm text-slate-400'>     
                    You don't have any requests yet.
            </div> 
        </section>
    )
}





