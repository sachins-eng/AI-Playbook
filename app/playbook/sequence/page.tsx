"use client";
import React, { useState, useEffect } from "react";
import { usePlaybookDetailsStore } from "@/store/playbookDetailsStore";
import SubsectionDrawer from "./_components/SubsectionDrawer";
import { MoreVertical, Trash2, Plus } from "lucide-react";

function PlaybookSequence() {
  const { playbookData } = usePlaybookDetailsStore();
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSubsectionClick = (subsection: any) => {
    setSelectedSubsection(subsection);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedSubsection(null), 400); // Wait for animation to complete
  };

  const handleDropdownToggle = (subsectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === subsectionId ? null : subsectionId);
  };

  const handleDeleteSubsection = (chapterIndex: number, sectionIndex: number, subsectionIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality with store update
    console.log(`Delete subsection: Chapter ${chapterIndex}, Section ${sectionIndex}, Subsection ${subsectionIndex}`);
    setOpenDropdown(null);
  };

  const handleAddSubsection = (chapterIndex: number, sectionIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add functionality with store update
    console.log(`Add new subsection: Chapter ${chapterIndex}, Section ${sectionIndex}`);
    setOpenDropdown(null);
  };

  const handleDeleteSection = (chapterIndex: number, sectionIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete section functionality with store update
    console.log(`Delete section: Chapter ${chapterIndex}, Section ${sectionIndex}`);
    setOpenDropdown(null);
  };

  const handleAddSection = (chapterIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add section functionality with store update
    console.log(`Add new section: Chapter ${chapterIndex}`);
    setOpenDropdown(null);
  };

  const handleDeleteChapter = (chapterIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete chapter functionality with store update
    console.log(`Delete chapter: Chapter ${chapterIndex}`);
    setOpenDropdown(null);
  };

  const handleAddChapter = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add chapter functionality with store update
    console.log(`Add new chapter`);
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

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
              <div className={`bg-white p-3 rounded-lg shadow text-center mb-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative group ${openDropdown === `chapter-${chapterIndex}` ? 'z-[101]' : 'z-10'}`}>
                <div>
                  {/* Chapter name and dropdown button */}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
                      {chapter.chapter_name}
                    </h2>
                    
                    {/* Chapter Dropdown Menu Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => handleDropdownToggle(`chapter-${chapterIndex}`, e)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      {/* Chapter Dropdown Menu */}
                      {openDropdown === `chapter-${chapterIndex}` && (
                        <div className="absolute right-0 top-8 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px]">
                          <button
                            onClick={(e) => handleAddChapter(e)}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Plus className="w-3 h-3" />
                            Add Chapter
                          </button>
                          <button
                            onClick={(e) => handleDeleteChapter(chapterIndex, e)}
                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete Chapter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Chapter description - full width */}
                  <p className="text-xs font-normal text-gray-500">
                    {chapter.chapter_description}
                  </p>
                </div>
              </div>

              {/* Stages in Horizontal Row */}
              <div className={`flex gap-4 flex-1 ${isDrawerOpen ? 'overflow-hidden' : 'overflow-x-auto'}`}>
                {/* Each Stage */}
                {chapter.sections?.map((stage: any, stageIndex: number) => (
                  <div 
                    key={stageIndex} 
                    className={`bg-white p-4 rounded-lg shadow-md w-[280px] flex-shrink-0 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slide-in-right group ${openDropdown === `section-${chapterIndex}-${stageIndex}` ? 'z-[101]' : 'z-10'}`}
                    style={{ 
                      animationDelay: `${(chapterIndex * 150) + (stageIndex * 100)}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <div className="mb-1">
                      {/* Section name and dropdown button */}
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900 flex-1 pr-2">{stage.section_name}</p>
                        
                        {/* Section Dropdown Menu Button */}
                        <div className="relative">
                          <button
                            onClick={(e) => handleDropdownToggle(`section-${chapterIndex}-${stageIndex}`, e)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100"
                            title="More options"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          {/* Section Dropdown Menu */}
                          {openDropdown === `section-${chapterIndex}-${stageIndex}` && (
                            <div className="absolute right-0 top-8 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px]">
                              <button
                                onClick={(e) => handleAddSection(chapterIndex, e)}
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Plus className="w-3 h-3" />
                                Add Section
                              </button>
                              <button
                                onClick={(e) => handleDeleteSection(chapterIndex, stageIndex, e)}
                                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete Section
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Section description - full width */}
                      <p className="text-xs font-normal text-gray-500">
                        {stage.section_description}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-blue-600 mb-2">
                      {stage.subsections?.length || 0} Activities
                    </div>

                    {/* Activities (fill remaining height and scroll vertically) */}
                    <div className={`flex-1 pr-1 ${isDrawerOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                      {stage.subsections?.map((activity: any, activityIndex: number) => {
                        const subsectionId = `${chapterIndex}-${stageIndex}-${activityIndex}`;
                        return (
                          <div 
                            key={activityIndex}
                            className={`bg-gray-100 p-4 mb-2 rounded text-sm shadow-sm transform transition-all duration-200 hover:bg-gray-200 hover:scale-105 animate-fade-in cursor-pointer relative group ${openDropdown === subsectionId ? 'z-[101]' : 'z-10'}`}
                            style={{ 
                              animationDelay: `${(chapterIndex * 150) + (stageIndex * 100) + (activityIndex * 50)}ms`,
                              animationFillMode: 'backwards'
                            }}
                            onClick={() => handleSubsectionClick(activity)}
                          >
                            <div>
                              {/* Name and dropdown button */}
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-medium flex-1 pr-2">{activity.subsection_name}</p>
                                
                                {/* Dropdown Menu Button */}
                                <div className="relative">
                                  <button
                                    onClick={(e) => handleDropdownToggle(subsectionId, e)}
                                    className="p-1 hover:bg-gray-300 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100"
                                    title="More options"
                                  >
                                    <MoreVertical className="w-4 h-4 text-gray-600" />
                                  </button>
                                
                                  {/* Dropdown Menu */}
                                  {openDropdown === subsectionId && (
                                    <div className="absolute right-0 top-8 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px]">
                                      <button
                                        onClick={(e) => handleAddSubsection(chapterIndex, stageIndex, e)}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Subsection Above
                                      </button>
                                      <button
                                        onClick={(e) => handleAddSubsection(chapterIndex, stageIndex, e)}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Subsection Below
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteSubsection(chapterIndex, stageIndex, activityIndex, e)}
                                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        Delete Subsection
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Description - full width */}
                              <p className="text-xs text-gray-600">
                                {activity.subsection_description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
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