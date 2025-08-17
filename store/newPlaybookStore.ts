import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NewPlaybookState {
  userRequest: string
  apiResult: any
  currentView: 'input' | 'result'
  questionAnswers: Record<number, string>
  skippedQuestions: Record<number, boolean>
  hasHydrated: boolean
  setUserRequest: (request: string) => void
  setApiResult: (result: any) => void
  setCurrentView: (view: 'input' | 'result') => void
  setQuestionAnswers: (answers: Record<number, string>) => void
  setSkippedQuestions: (skipped: Record<number, boolean>) => void
  clearData: () => void
  setHasHydrated: (state: boolean) => void
}

export const useNewPlaybookStore = create<NewPlaybookState>()(
  persist(
    (set) => ({
      userRequest: '',
      apiResult: null,
      currentView: 'input',
      questionAnswers: {},
      skippedQuestions: {},
      hasHydrated: false,
      setUserRequest: (request: string) => set({ userRequest: request }),
      setApiResult: (result: any) => set({ apiResult: result }),
      setCurrentView: (view: 'input' | 'result') => set({ currentView: view }),
      setQuestionAnswers: (answers: Record<number, string>) => set({ questionAnswers: answers }),
      setSkippedQuestions: (skipped: Record<number, boolean>) => set({ skippedQuestions: skipped }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      clearData: () => set({
        userRequest: '',
        apiResult: null,
        currentView: 'input',
        questionAnswers: {},
        skippedQuestions: {},
      }),
    }),
    {
      name: 'new-playbook-storage', // unique name for localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)