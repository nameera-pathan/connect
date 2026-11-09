import React from 'react'

export default function Requests({setShowRequests, setShowSearchAndConvo}) {
    const handleReturn = () =>{
        setShowRequests(false)
        setShowSearchAndConvo(true)
    }  
    return (
        <section>
            <button onClick={()=>handleReturn()}>Back</button>
            <div className='flex justify-center items-center h-[100%] text-sm text-slate-400'>     
                    You don't have any requests yet.
            </div> 
        </section>
    )
}





