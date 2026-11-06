import { useState } from 'react'
import { FilterIcon, ReturnIcon, SearchIcon } from '../assets'
import { useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function Search({searchLength, setSearchResults, inputRef, show, setShow}) {
    const { user } = useSelector((state) => state.user);
    const token = user.token
    const handleSearch = async (e) =>{
        if(e.target.value && e.key == 'Enter'){
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/search?u=${e.target.value}`, {
                    headers: {Authorization: `Bearer ${token}`}
                })
                setSearchResults(response.data.data)
            } catch (err) {
                console.log(err.response.data)
            }
        }
        else{
            setSearchResults([])
        }
    }
    
    return (
        <section className='h-[49px] py-1.5'>
            <div className='px-[10px]'>
                {/* search input */}
                <div className="flex items-center gap-x-2">
                    <div className="w-full bg-dark_bg_2 rounded-lg pl-2 flex ">
                        {show || searchLength > 0 
                        ? <span className="w-8 flex items-center justify-center rotateAnimation cursor-pointer" onClick={()=>{
                            inputRef.current.value = ''
                            setSearchResults([])
                            }}>
                            <ReturnIcon className='dark:fill-green-300 w-5' />
                          </span>
                        : <span className="w-8 flex items-center justify-center">
                            <SearchIcon className='dark:fill-slate-300 w-5' />
                          </span> }
                          <input
                          type='text'
                          placeholder='Search or start a new chat'
                          ref={inputRef}
                          className='w-full dark:bg-dark_bg_2 p-1.5 dark:text- rounded-lg flex-1 outline-none'
                          onFocus={()=>{setShow(true)}}
                          onBlur={()=> searchLength == 0 && setShow(false) }
                          onKeyDown={(e)=>{handleSearch(e)}}
                          spellCheck='false'
                          />
                    </div>
                    <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center">
                        <FilterIcon className='dark:fill-white' />
                    </button>
                    
                </div>

            </div>
        </section>
    )
}




