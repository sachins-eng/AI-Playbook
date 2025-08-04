"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAnalyze } from "@/context/AnalyzeContext";

function SecondStep() {
  const { userRequest, apiResult, setCurrentView } = useAnalyze();

  const handleBack = () => {
    setCurrentView('input');
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-1 px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Let's refine your idea
          </h1>
        </div>

        <div className="flex flex-1 gap-6 mx-auto w-full">
          {/* First Section - User Request and API Details */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="border rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Your Request
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                  {userRequest}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Analysis Details
              </h2>
              <div className="space-y-4">
                {apiResult?.intent && (
                  <div>
                    <h3 className="font-medium text-neutral-600 dark:text-neutral-400 mb-2">Intent</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-neutral-800 dark:text-neutral-200">{apiResult.intent}</p>
                    </div>
                  </div>
                )}
                {apiResult?.type && (
                  <div>
                    <h3 className="font-medium text-neutral-600 dark:text-neutral-400 mb-2">Type</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-neutral-800 dark:text-neutral-200">{apiResult.type}</p>
                    </div>
                  </div>
                )}
                {apiResult?.context && (
                  <div>
                    <h3 className="font-medium text-neutral-600 dark:text-neutral-400 mb-2">Context</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-neutral-800 dark:text-neutral-200">{apiResult.context}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Second Section - Questions */}
          <div className="flex-1 flex flex-col">
            <div className="border rounded-2xl p-6 shadow-md flex-1">
              <h2 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Clarification Questions
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-full">
                {apiResult?.questions && Array.isArray(apiResult.questions) ? (
                  <ul className="space-y-3">
                    {apiResult.questions.map((question: string, index: number) => (
                      <li key={index} className="text-neutral-800 dark:text-neutral-200">
                        <span className="font-medium text-blue-600 dark:text-blue-400">{index + 1}. </span>
                        {question}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-400 italic">
                    No questions available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondStep;