"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnalyze } from "@/context/AnalyzeContext";

function PlaybookDetails() {
  const router = useRouter();
  const { playbookData } = useAnalyze();

  console.log("Playbook Data:", playbookData);

  const handleBack = () => {
    router.back();
  };

  const handleCopyToClipboard = () => {
    if (playbookData) {
      navigator.clipboard.writeText(JSON.stringify(playbookData, null, 2));
      // You could add a toast notification here
    }
  };

  const handleDownload = () => {
    if (playbookData) {
      const blob = new Blob([JSON.stringify(playbookData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "playbook.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header with navigation and actions */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            {playbookData?.playbook?.name || "Generated Playbook"}
          </h1>
        </div>
        
        {playbookData && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4">
        {playbookData?.playbook?.chapters ? (
          <div className="flex gap-6 overflow-x-auto h-full">
            {/* Each chapter */}
            {playbookData.playbook.chapters.map((chapter: any, chapterIndex: number) => (
              <div key={chapterIndex} className="flex flex-col min-w-[400px] flex-shrink-0 h-full">
                {/* Chapter Header */}
                <div className="bg-white p-3 rounded-lg shadow text-center mb-2">
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
                      className="bg-white p-3 rounded-lg shadow-md w-[280px] flex-shrink-0 flex flex-col h-full"
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
                            className="bg-gray-100 p-2 mb-2 rounded text-sm shadow-sm"
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
                No Playbook Data Found
              </h2>
              <p className="text-gray-600 mb-4">
                The playbook data could not be loaded. Please try generating a new playbook.
              </p>
              <Button
                variant="default"
                onClick={() => router.push("/create-new-playbook")}
              >
                Create New Playbook
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaybookDetails;