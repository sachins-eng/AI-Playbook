"use client";
import React from 'react'
import { usePlaybookStore } from '@/store/playbookStore'
import FirstStep from './_components/FirstStep'
import SecondStep from './_components/SecondStep'

function page() {
  const { currentView, hasHydrated } = usePlaybookStore();

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex mx-auto items-center justify-center'>
        {currentView === 'input' ? <FirstStep /> : <SecondStep />}
      </div>
    </div>
  )
}

export default page
