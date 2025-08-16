import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlaybookState {
  userRequest: string
  apiResult: any
  currentView: 'input' | 'result'
  playbookData: any
  hasHydrated: boolean
  setUserRequest: (request: string) => void
  setApiResult: (result: any) => void
  setCurrentView: (view: 'input' | 'result') => void
  setPlaybookData: (data: any) => void
  clearData: () => void
  setHasHydrated: (state: boolean) => void
}

export const usePlaybookStore = create<PlaybookState>()(
  persist(
    (set) => ({
      userRequest: '',
      apiResult: null,
      currentView: 'input',
      playbookData: null,
      hasHydrated: false,
      setUserRequest: (request: string) => set({ userRequest: request }),
      setApiResult: (result: any) => set({ apiResult: result }),
      setCurrentView: (view: 'input' | 'result') => set({ currentView: view }),
      setPlaybookData: (data: any) => set({ playbookData: data }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      clearData: () => set({
        userRequest: '',
        apiResult: null,
        currentView: 'input',
        playbookData: null,
      }),
    }),
    {
      name: 'playbook-storage', // unique name for localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)