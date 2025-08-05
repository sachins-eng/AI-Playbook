"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { useAnalyze } from "@/context/AnalyzeContext";

function SecondStep() {
  const { userRequest, apiResult, setCurrentView } = useAnalyze();
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});

  const handleBack = () => {
    setCurrentView('input');
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleGenerateDraftAnswer = (questionIndex: number, question: string) => {
    console.log(`Generating draft answer for question ${questionIndex + 1}:`, question);
    // TODO: Implement LLM API call to generate draft answer
    // For now, just add placeholder text
    const draftAnswer = `[AI-generated draft for: ${question}]`;
    handleAnswerChange(questionIndex, draftAnswer);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex flex-col flex-1 px-4 py-8 min-h-0">
        <div className="mb-6 flex items-center flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Let's refine your idea{apiResult?.intent && ` - ${apiResult.intent}`}
          </h1>
        </div>

        <div className="flex flex-1 gap-6 mx-auto w-full min-h-0">
          {/* First Section - User Request and API Details */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
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
                Request Analysis
              </h2>
              <div className="space-y-4">
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
          <div className="flex-1 flex flex-col min-h-0">
            <div className="border rounded-2xl p-6 shadow-md flex-1 flex flex-col min-h-0">
              <h2 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                Your inputs will help us to create the perfect playbook
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex-1 overflow-y-auto min-h-0">
                {apiResult?.questions?.questions && Array.isArray(apiResult.questions.questions) ? (
                  <div className="space-y-6">
                    {apiResult.questions.questions.map((questionObj: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                        <div className="mb-3">
                          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                            <span className="text-blue-600 dark:text-blue-400 mr-2">{index + 1}.</span>
                            {questionObj.question}
                            {questionObj.mandatory && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h3>
                          {questionObj.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                              {questionObj.description}
                            </p>
                          )}
                        </div>
                        <div className="border rounded-2xl p-4 shadow-md relative">
                          <Textarea
                            placeholder="Enter your answer here..."
                            className="w-full min-h-32 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-y"
                            value={questionAnswers[index] || ""}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleGenerateDraftAnswer(index, questionObj.question)}
                            title="Generate draft answer with AI"
                          >
                            <Lightbulb className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-600 dark:text-neutral-400 italic text-center">
                      No questions available
                    </p>
                  </div>
                )}
              </div>
              
              {apiResult?.questions?.questions && Array.isArray(apiResult.questions.questions) && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Button 
                    variant="default"
                    className="w-full font-medium py-3"
                    onClick={() => {
                      console.log("Generating playbook with answers:", questionAnswers);
                      // Handle playbook generation here
                    }}
                  >
                    Generate Playbook
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondStep;