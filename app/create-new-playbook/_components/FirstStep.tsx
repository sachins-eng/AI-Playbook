"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, X, Paperclip, FileText } from "lucide-react";
import { usePlaybookStore } from "@/store/playbookStore";

function ChatBox() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { userRequest, setUserRequest, setApiResult, setCurrentView } = usePlaybookStore();

  // Pre-populate with existing request when component mounts
  React.useEffect(() => {
    if (userRequest && !goal) {
      setGoal(userRequest);
    }
  }, [userRequest, goal]);

  const handleClear = () => {
    setGoal("");
    setUserRequest(""); // Clear the context as well
    setAttachedFile(null);
    // Reset the file input value
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    // Reset the file input value so the same file can be selected again
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSend = async () => {
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);
    setUserRequest(goal);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: goal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiResult(data);
        setCurrentView('result');
        console.log("API Response:", data);
      } else {
        console.error("API Error:", response.status);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-1 items-center justify-center px-4">
        <div className="mb-6 text-center text-3xl text-neutral-800 dark:text-neutral-200">
          Let's build something awesome!
        </div>
        <div className="border rounded-2xl p-4 shadow-md w-full max-w-4xl flex flex-col">
          <Textarea
            placeholder="What do you want to create?"
            className="w-full h-48 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          {attachedFile && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {attachedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(attachedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={removeAttachment}
                className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                size="icon"
                variant="ghost"
                className="cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isLoading}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              {goal && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                size={isLoading ? "default" : "icon"}
                className="cursor-pointer"
                onClick={() => onSend()}
                disabled={isLoading || !goal.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
