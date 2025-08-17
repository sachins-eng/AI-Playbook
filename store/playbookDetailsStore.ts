import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlaybookDetailsState {
  playbookData: any
  hasHydrated: boolean
  setPlaybookData: (data: any) => void
  clearPlaybookData: () => void
  setHasHydrated: (state: boolean) => void
  moveSubsection: (
    fromChapter: number, 
    fromSection: number, 
    fromSubsection: number,
    toChapter: number, 
    toSection: number, 
    toSubsection?: number
  ) => void
  reorderSubsection: (
    chapterIndex: number,
    sectionIndex: number,
    fromIndex: number,
    toIndex: number
  ) => void
}

export const usePlaybookDetailsStore = create<PlaybookDetailsState>()(
  persist(
    (set, get) => ({
      playbookData: null,
      hasHydrated: false,
      setPlaybookData: (data: any) => set({ playbookData: data }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      clearPlaybookData: () => set({
        playbookData: null,
      }),
      
      moveSubsection: (fromChapter, fromSection, fromSubsection, toChapter, toSection, toSubsection) => {
        const { playbookData } = get();
        if (!playbookData?.playbook?.chapters) return;

        const newPlaybookData = JSON.parse(JSON.stringify(playbookData));
        const chapters = newPlaybookData.playbook.chapters;

        // Get the subsection to move
        const subsectionToMove = chapters[fromChapter]?.sections?.[fromSection]?.subsections?.[fromSubsection];
        if (!subsectionToMove) return;

        // Ensure destination section exists and has subsections array
        if (!chapters[toChapter]?.sections?.[toSection]) return;
        if (!chapters[toChapter].sections[toSection].subsections) {
          chapters[toChapter].sections[toSection].subsections = [];
        }

        const sourceSubsections = chapters[fromChapter].sections[fromSection].subsections;
        const targetSubsections = chapters[toChapter].sections[toSection].subsections;

        console.log('Moving subsection:', {
          from: { chapter: fromChapter, section: fromSection, subsection: fromSubsection },
          to: { chapter: toChapter, section: toSection, subsection: toSubsection },
          sourceLength: sourceSubsections.length,
          targetLength: targetSubsections.length,
          subsectionName: subsectionToMove.subsection_name
        });

        // Create a deep copy of the subsection to move
        const movedSubsection = JSON.parse(JSON.stringify(subsectionToMove));
        
        // Remove from source - only remove 1 item
        sourceSubsections.splice(fromSubsection, 1);

        // Add to destination
        if (toSubsection !== undefined) {
          // Insert at specific position
          targetSubsections.splice(toSubsection, 0, movedSubsection);
        } else {
          // Add to end
          targetSubsections.push(movedSubsection);
        }

        console.log('After move:', {
          sourceLength: sourceSubsections.length,
          targetLength: targetSubsections.length
        });

        set({ playbookData: newPlaybookData });
      },

      reorderSubsection: (chapterIndex, sectionIndex, fromIndex, toIndex) => {
        const { playbookData } = get();
        if (!playbookData?.playbook?.chapters) return;

        const newPlaybookData = JSON.parse(JSON.stringify(playbookData));
        const subsections = newPlaybookData.playbook.chapters[chapterIndex]?.sections?.[sectionIndex]?.subsections;
        
        if (!subsections || fromIndex === toIndex) return;

        // Move the subsection
        const [movedSubsection] = subsections.splice(fromIndex, 1);
        subsections.splice(toIndex, 0, movedSubsection);

        set({ playbookData: newPlaybookData });
      },
    }),
    {
      name: 'playbook-details-storage', // unique name for localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)