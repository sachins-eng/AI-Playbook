"use client";
import React from "react";
import { usePlaybookDetailsStore } from "@/store/playbookDetailsStore";
import ImageSelector from "./_components/ImageSelector";

function PlaybookDetails() {
  const { playbookData, hasHydrated, setPlaybookData } = usePlaybookDetailsStore();

  const handleImageChange = (newImageUrl: string) => {
    if (playbookData) {
      const updatedPlaybookData = {
        ...playbookData,
        playbook: {
          ...playbookData.playbook,
          imageUrl: newImageUrl
        }
      };
      setPlaybookData(updatedPlaybookData);
    }
  };

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!playbookData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Playbook Data
          </h2>
          <p className="text-gray-600">
            No playbook details available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 animate-fade-in-up">Playbook Details</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Basic Information
        </h2>
        
        {/* Playbook Image */}
        <ImageSelector
          currentImageUrl={playbookData?.playbook?.imageUrl}
          requestType={playbookData?.playbook?.type || ""}
          context={playbookData?.playbook?.context || ""}
          onImageChange={handleImageChange}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-slide-in-right" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
              Name
            </label>
            <p className="text-gray-900">{playbookData?.playbook?.name || "Unnamed Playbook"}</p>
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
              Type
            </label>
            <p className="text-gray-900">{playbookData?.playbook?.type || "Not specified"}</p>
          </div>
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
              Description
            </label>
            <p className="text-gray-900">{playbookData?.playbook?.description || "No description available"}</p>
          </div>
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '350ms', animationFillMode: 'backwards' }}>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
              Context
            </label>
            <p className="text-gray-900">{playbookData?.playbook?.context || "No context provided"}</p>
          </div>
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
              Prerequisites
            </label>
            <div className="text-gray-900">
              {playbookData?.playbook?.prerequisites ? (
                Array.isArray(playbookData.playbook.prerequisites) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {playbookData.playbook.prerequisites.map((prerequisite: string, index: number) => (
                      <li key={index}>{prerequisite}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{playbookData.playbook.prerequisites}</p>
                )
              ) : (
                <p className="text-gray-500 italic">No prerequisites specified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Raw Data
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96 animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
            {JSON.stringify(playbookData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default PlaybookDetails;