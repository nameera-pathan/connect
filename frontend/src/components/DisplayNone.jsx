import React from 'react'
import { Logo } from '../assets'

export default function DisplayNone() {
    return (
        <section className='h-full w-full bg-dark_bg_4 select-none border-1-dark_border_1 border-b-[6px] border-b_green_2'>
            <div className="-mt-1 5 w-full h-full flex flex-col gap-y-8 items-center justify-center">
                <span>
                    <Logo/>
                </span>
                <div className="mt-1 text-center space-y-[12px]">
                    <h1 className="text-dark_text_4 font-extralight text-[32px]">
                        Ping Me web
                    </h1>
                </div>
            </div>
        </section>
    )
}



