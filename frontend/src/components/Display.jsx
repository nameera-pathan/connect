import React from 'react'
import DisplayNone from './DisplayNone'
import Profile from './Profile'

export default function Display({showProfile, setShowProfile}) {


    return (
        <>
            {
                showProfile ?
                <div className='h-full w-full bg-dark_bg_4 select-none border-1-dark_border_1  border-b_green_2'>
                    <Profile setShowProfile={setShowProfile} /> 
                </div>
                : <DisplayNone/>
            }
        </>

    )
}
