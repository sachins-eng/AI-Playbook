"use client";
import React from "react";
import { usePlaybookDetailsStore } from "@/store/playbookDetailsStore";
import { Users, User } from "lucide-react";

function PlaybookRoles() {
  const { playbookData, hasHydrated } = usePlaybookDetailsStore();

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
          <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Playbook Data
          </h2>
          <p className="text-gray-600">
            No role information available.
          </p>
        </div>
      </div>
    );
  }

  // Extract roles from playbook data (this might need adjustment based on your data structure)
  const roles = playbookData?.playbook?.roles || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Playbook Roles</h1>
      </div>
      
      {roles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {role.name || `Role ${index + 1}`}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-600 text-sm">
                    {role.description || "No description available"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibilities
                  </label>
                  <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                    {role.responsibilities?.map((responsibility: string, idx: number) => (
                      <li key={idx}>{responsibility}</li>
                    )) || <li>No responsibilities defined</li>}
                  </ul>
                </div>

                {role.skills && role.skills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {role.skills.map((skill: string, idx: number) => (
                        <span 
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Roles Defined</h3>
          <p className="text-gray-600">
            This playbook doesn't have any roles defined yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlaybookRoles;