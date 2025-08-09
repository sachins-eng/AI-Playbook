"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Lightbulb, X, Loader2, PenTool, Send } from "lucide-react";
import { useAnalyze } from "@/context/AnalyzeContext";
import { useRouter } from "next/navigation";

function SecondStep() {
  const { userRequest, apiResult, setCurrentView, setUserRequest, setApiResult, setPlaybookData } = useAnalyze();
  const router = useRouter();
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<Record<number, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadingAnswers, setLoadingAnswers] = useState<Record<number, boolean>>({});
  const [isEditingRequest, setIsEditingRequest] = useState(false);
  const [editedRequest, setEditedRequest] = useState("");
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isGeneratingPlaybook, setIsGeneratingPlaybook] = useState(false);

  const handleBack = () => {
    setCurrentView('input');
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleGenerateDraftAnswer = async (questionIndex: number, question: string) => {
    setLoadingAnswers(prev => ({ ...prev, [questionIndex]: true }));
    
    try {
      const questionObj = apiResult?.questions?.questions[questionIndex];
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRequest,
          intent: apiResult?.intent,
          type: apiResult?.type,
          context: apiResult?.context,
          question,
          placeholder: questionObj?.placeholder,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        handleAnswerChange(questionIndex, data.draftAnswer);
      } else {
        console.error("API Error:", response.status);
        handleAnswerChange(questionIndex, "Error generating answer. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      handleAnswerChange(questionIndex, "Error generating answer. Please try again.");
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [questionIndex]: false }));
    }
  };

  const handleClearAnswer = (questionIndex: number) => {
    handleAnswerChange(questionIndex, "");
  };

  const handleToggleSkip = (questionIndex: number) => {
    setSkippedQuestions(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
    // Clear answer when skipping
    if (!skippedQuestions[questionIndex]) {
      handleAnswerChange(questionIndex, "");
    }
  };

  const handlePlaybookAPI = async (payload: { intent: string; context: string; type: string }) => {
    try {
      const response = await fetch("/api/playbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Playbook API Response:", data);
        // Store playbook data in context and navigate to playbook details page
        setPlaybookData(data);
        router.push('/playbook-details');
      } else {
        console.error("Playbook API Error:", response.status);
        setErrorMessage("Failed to generate playbook. Please try again.");
      }
    } catch (error) {
      console.error("Playbook API Network Error:", error);
      setErrorMessage("Failed to generate playbook. Please try again.");
    }
  };

  const handleContextAPI = async (payload: any) => {
    setIsGeneratingPlaybook(true);
    try {
      const response = await fetch("/api/context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Context API Response:", data);
        // Update apiResult context with the response
        const updatedContext = data.updated_context || data.context || data;
        setApiResult((prev: any) => ({
          ...prev,
          context: updatedContext
        }));
        
        // Call playbook API after context is updated
        await handlePlaybookAPI({
          intent: payload.intent,
          context: updatedContext,
          type: payload.type
        });
      } else {
        console.error("Context API Error:", response.status);
        setErrorMessage("Failed to generate playbook. Please try again.");
      }
    } catch (error) {
      console.error("Context API Network Error:", error);
      setErrorMessage("Failed to generate playbook. Please try again.");
    } finally {
      setIsGeneratingPlaybook(false);
    }
  };

  const handleGeneratePlaybook = () => {
    const questions = apiResult?.questions?.questions || [];
    const unansweredQuestions: number[] = [];
    
    questions.forEach((_: any, index: number) => {
      const isSkipped = skippedQuestions[index];
      const hasAnswer = questionAnswers[index]?.trim();
      
      if (!isSkipped && !hasAnswer) {
        unansweredQuestions.push(index + 1);
      }
    });

    if (unansweredQuestions.length > 0) {
      setErrorMessage(`Please answer or skip the following questions before generating the playbook: ${unansweredQuestions.join(', ')}`);
      return;
    }

    // Clear any previous error message
    setErrorMessage("");
    
    // Consolidate all answered questions into an object array
    const consolidatedQA = questions
      .map((questionObj: any, index: number) => {
        const isSkipped = skippedQuestions[index];
        const answer = questionAnswers[index]?.trim();
        
        if (!isSkipped && answer) {
          return {
            question: questionObj.question,
            description: questionObj.description,
            answer: answer
          };
        }
        return null;
      })
      .filter((qa: any) => qa !== null);
    
    console.log("Consolidated Questions and Answers:", consolidatedQA);
    
    // Prepare payload for context API
    const payload = {
      intent: apiResult.intent,
      type: apiResult.type,
      context: apiResult.context,
      responses: consolidatedQA
    };
    
    // Call context API route
    handleContextAPI(payload);


  };

  const handleEditRequest = () => {
    setIsEditingRequest(true);
    setEditedRequest(userRequest);
  };

  const handleCancelEdit = () => {
    setIsEditingRequest(false);
    setEditedRequest("");
  };

  const isAnyAIGenerating = Object.values(loadingAnswers).some(loading => loading);

  const handleSaveRequest = async () => {
    if (!editedRequest.trim() || isLoadingRequest) return;

    setIsLoadingRequest(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: editedRequest.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRequest(editedRequest.trim());
        setApiResult(data);
        setIsEditingRequest(false);
        setEditedRequest("");
        // Clear existing answers since we have new questions
        setQuestionAnswers({});
        setSkippedQuestions({});
        setErrorMessage("");
      } else {
        console.error("API Error:", response.status);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setIsLoadingRequest(false);
    }
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
            disabled={isGeneratingPlaybook}
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
              {isEditingRequest ? (
                <div className="border rounded-2xl p-4 shadow-md w-full relative">
                  <Textarea
                    placeholder="What do you want to create?"
                    className="w-full min-h-32 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-none pb-14 pr-20"
                    value={editedRequest}
                    onChange={(e) => setEditedRequest(e.target.value)}
                    disabled={isLoadingRequest || isGeneratingPlaybook}
                  />
                  {editedRequest && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-16 bottom-4 cursor-pointer"
                      onClick={handleCancelEdit}
                      disabled={isLoadingRequest || isGeneratingPlaybook}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size={isLoadingRequest ? "default" : "icon"}
                    className="absolute right-4 bottom-4 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSaveRequest}
                    disabled={isLoadingRequest || isGeneratingPlaybook || !editedRequest.trim()}
                  >
                    {isLoadingRequest ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="border rounded-2xl p-4 shadow-md w-full relative">
                  <div className="w-full min-h-32 text-base bg-transparent pb-14 pr-20">
                    <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                      {userRequest}
                    </p>
                  </div>
                  <button
                    className="absolute right-4 bottom-4 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleEditRequest}
                    title="Edit your request"
                    disabled={isAnyAIGenerating || isGeneratingPlaybook}
                  >
                    <PenTool className="w-4 h-4 text-gray-500 hover:text-primary" />
                  </button>
                </div>
              )}
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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex-1 overflow-y-auto min-h-0 mb-4">
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
                        <div className={`border rounded-2xl p-4 shadow-md w-full relative ${skippedQuestions[index] ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                          {(!questionAnswers[index]?.trim() || skippedQuestions[index]) && (
                            <Button
                              variant={skippedQuestions[index] ? "default" : "outline"}
                              size="sm"
                              className={`absolute left-4 bottom-4 cursor-pointer text-xs z-10 ${skippedQuestions[index] ? 'opacity-100' : ''}`}
                              onClick={() => handleToggleSkip(index)}
                              disabled={isLoadingRequest || loadingAnswers[index] || isGeneratingPlaybook}
                            >
                              {skippedQuestions[index] ? "Unskip" : "Skip"}
                            </Button>
                          )}
                          <Textarea
                            placeholder={questionObj.placeholder || "Enter your answer here..."}
                            className={`w-full min-h-32 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-none pb-14 pr-20 ${skippedQuestions[index] ? 'opacity-50' : ''}`}
                            value={questionAnswers[index] || ""}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            disabled={skippedQuestions[index] || isLoadingRequest || isGeneratingPlaybook}
                          />
                          {questionAnswers[index] && !skippedQuestions[index] && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute right-16 bottom-4 cursor-pointer"
                              onClick={() => handleClearAnswer(index)}
                              disabled={isLoadingRequest || isGeneratingPlaybook}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          {!skippedQuestions[index] && (
                            <button
                              className="absolute right-4 bottom-4 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => handleGenerateDraftAnswer(index, questionObj.question)}
                              title={loadingAnswers[index] ? "Generating answer..." : "Let AI generate a draft answer"}
                              disabled={loadingAnswers[index] || isLoadingRequest || isGeneratingPlaybook}
                            >
                              {loadingAnswers[index] ? (
                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                              ) : (
                                <Lightbulb className="w-4 h-4 text-gray-500 hover:text-primary" />
                              )}
                            </button>
                          )}
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
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {errorMessage}
                      </p>
                    </div>
                  )}
                  <Button 
                    variant="default"
                    className="w-full font-medium py-3 cursor-pointer"
                    onClick={handleGeneratePlaybook}
                    disabled={isLoadingRequest || isGeneratingPlaybook}
                  >
                    {isGeneratingPlaybook ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Playbook...
                      </>
                    ) : (
                      "Generate Playbook"
                    )}
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