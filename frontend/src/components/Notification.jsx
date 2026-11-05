import React from 'react'
import { ArrowIcon, CloseIcon, NotificationIcon } from '../assets'

export default function Notification() {
  return (
        <section className='h-[90px] dark:bg-dark_bg_3 flex items-center p-[13px]'>
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                    <NotificationIcon className='dark:fill-blue-200' />
                    <div className="flex flex-col">
                        <span className="textPrimary">Get notified of new messages.</span>
                        <span className="textSecondary mt-0.5 flex items-center gap-0.5">
                            Turn on desktop notification
                            <ArrowIcon className='dark:fill-blue-300 mt-1'/>
                        </span>
                    </div>
                </div>
                <CloseIcon className='darl:fill-white cursor-pointer' />
            </div>
        </section>
  )
}
