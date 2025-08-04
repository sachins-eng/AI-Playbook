import React from 'react'

import ChatBox from './_components/ChatBot'
import FirstStep from './_components/FirstStep'

function page() {
  return (

    <div>
       <div className='flex mx-auto items-center justify-center'>
            <FirstStep />
       </div>
    </div>


     /*
    <div className='grid grid-cols-1 gap-5 p-10 md:grid-cols-2'>
       <div>
            Chatbot
            <ChatBox />
       </div>
       <div>
            Playbook Details
       </div>
    </div>
    */
  )
}

export default page
