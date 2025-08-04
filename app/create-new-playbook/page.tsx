"use client";
import React from 'react'
import { useAnalyze } from '@/context/AnalyzeContext'
import FirstStep from './_components/FirstStep'
import SecondStep from './_components/SecondStep'

function page() {
  const { currentView } = useAnalyze();

  return (
    <div>
      <div className='flex mx-auto items-center justify-center'>
        {currentView === 'input' ? <FirstStep /> : <SecondStep />}
      </div>
    </div>
  )
}

export default page
