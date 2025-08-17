import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlaybookDetailsState {
  playbookData: any
  hasHydrated: boolean
  setPlaybookData: (data: any) => void
  clearPlaybookData: () => void
  setHasHydrated: (state: boolean) => void
}

export const usePlaybookDetailsStore = create<PlaybookDetailsState>()(
  persist(
    (set) => ({
      playbookData: null,
      hasHydrated: false,
      setPlaybookData: (data: any) => set({ playbookData: data }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      clearPlaybookData: () => set({
        playbookData: null,
      }),
    }),
    {
      name: 'playbook-details-storage', // unique name for localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)