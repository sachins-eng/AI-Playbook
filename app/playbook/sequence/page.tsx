"use client";
import React, { useState } from "react";
import { usePlaybookDetailsStore } from "@/store/playbookDetailsStore";
import SubsectionDrawer from "./_components/SubsectionDrawer";

function PlaybookSequence() {
  const { playbookData } = usePlaybookDetailsStore();
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSubsectionClick = (subsection: any) => {
    setSelectedSubsection(subsection);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedSubsection(null), 400); // Wait for animation to complete
  };

  return (
    <div className={`p-4 transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isDrawerOpen ? 'pr-[500px]' : ''}`} style={{ overflowX: 'auto' }}>
      {playbookData?.playbook?.chapters ? (
        <div className="flex gap-6 overflow-x-auto h-full" style={{ minWidth: 'max-content', width: 'max-content' }}>
          {/* Each chapter */}
          {playbookData.playbook.chapters.map((chapter: any, chapterIndex: number) => (
            <div 
              key={chapterIndex} 
              className="flex flex-col min-w-[400px] flex-shrink-0 h-full animate-fade-in-up"
              style={{ 
                animationDelay: `${chapterIndex * 150}ms`,
                animationFillMode: 'backwards'
              }}
            >
              {/* Chapter Header */}
              <div className="bg-white p-3 rounded-lg shadow text-center mb-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  {chapter.chapter_name}
                </h2>
                <p className="mt-1 mb-2 text-xs font-normal text-gray-500">
                  {chapter.chapter_description}
                </p>
              </div>

              {/* Stages in Horizontal Row */}
              <div className="flex gap-4 overflow-x-auto flex-1">
                {/* Each Stage */}
                {chapter.sections?.map((stage: any, stageIndex: number) => (
                  <div 
                    key={stageIndex} 
                    className="bg-white p-4 rounded-lg shadow-md w-[280px] flex-shrink-0 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slide-in-right"
                    style={{ 
                      animationDelay: `${(chapterIndex * 150) + (stageIndex * 100)}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      <p>{stage.section_name}</p>
                      <p className="mt-1 mb-2 text-xs font-normal text-gray-500">
                        {stage.section_description}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-blue-600 mb-2">
                      {stage.subsections?.length || 0} Activities
                    </div>

                    {/* Activities (fill remaining height and scroll vertically) */}
                    <div className="flex-1 overflow-y-auto pr-1">
                      {stage.subsections?.map((activity: any, activityIndex: number) => (
                        <div 
                          key={activityIndex}
                          className="bg-gray-100 p-4 mb-2 rounded text-sm shadow-sm transform transition-all duration-200 hover:bg-gray-200 hover:scale-105 animate-fade-in cursor-pointer"
                          style={{ 
                            animationDelay: `${(chapterIndex * 150) + (stageIndex * 100) + (activityIndex * 50)}ms`,
                            animationFillMode: 'backwards'
                          }}
                          onClick={() => handleSubsectionClick(activity)}
                        >
                          <p className="font-medium">{activity.subsection_name}</p>
                          <p className="mt-2 text-xs text-gray-600">
                            {activity.subsection_description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : playbookData ? (
        /* Fallback: Show raw JSON if structure doesn't match expected format */
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Playbook Data
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[70vh]">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {JSON.stringify(playbookData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        /* No data state */
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Playbook Data
            </h2>
            <p className="text-gray-600">
              No sequence data available.
            </p>
          </div>
        </div>
      )}

      {/* Off-canvas Drawer */}
      <SubsectionDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        subsection={selectedSubsection}
      />
    </div>
  );
}

export default PlaybookSequence;