"use client";
import React from "react";
import { X, Clock, Users, Target, CheckCircle } from "lucide-react";

interface SubsectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subsection: any;
}

const SubsectionDrawer: React.FC<SubsectionDrawerProps> = ({
  isOpen,
  onClose,
  subsection,
}) => {
  if (!subsection) return null;

  return (
    <>
      {/* Overlay - removed for better UX */}

      {/* Drawer */}
      <div
        className={`fixed top-20 right-0 h-[calc(100vh-80px)] w-[500px] bg-white shadow-2xl z-60 ${
          isOpen 
            ? "animate-drawer-slide-in" 
            : "animate-drawer-slide-out transform translate-x-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 relative z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Activity Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 border border-gray-300 hover:border-gray-400 relative z-10"
          >
            <X className="w-4 h-4 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          {/* Title */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {subsection.subsection_name || "Untitled Activity"}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {subsection.subsection_description || "No description available"}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-4 mb-6">
            {subsection.duration && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Duration</p>
                  <p className="text-blue-700">{subsection.duration}</p>
                </div>
              </div>
            )}

            {subsection.participants && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Participants</p>
                  <p className="text-green-700">{subsection.participants}</p>
                </div>
              </div>
            )}

            {subsection.objective && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Objective</p>
                  <p className="text-purple-700">{subsection.objective}</p>
                </div>
              </div>
            )}
          </div>

          {/* Steps or Tasks */}
          {subsection.steps && subsection.steps.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                Steps to Complete
              </h4>
              <div className="space-y-2">
                {subsection.steps.map((step: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-sm font-medium rounded-full flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {subsection.resources && subsection.resources.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Resources
              </h4>
              <div className="space-y-2">
                {subsection.resources.map((resource: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <p className="text-sm font-medium text-yellow-900">
                      {resource.name || resource}
                    </p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-yellow-700 hover:text-yellow-800 underline"
                      >
                        {resource.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data for Development */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Raw Data (Development)
            </h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(subsection, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubsectionDrawer;