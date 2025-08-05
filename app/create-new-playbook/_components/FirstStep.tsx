"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, X } from "lucide-react";
import { useAnalyze } from "@/context/AnalyzeContext";

function ChatBox() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userRequest, setUserRequest, setApiResult, setCurrentView } = useAnalyze();

  // Pre-populate with existing request when component mounts
  React.useEffect(() => {
    if (userRequest && !goal) {
      setGoal(userRequest);
    }
  }, [userRequest, goal]);

  const handleClear = () => {
    setGoal("");
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
          {userRequest ? "Refine your request" : "Let's build something awesome!"}
        </div>
        <div className="border rounded-2xl p-4 shadow-md w-full max-w-4xl relative">
          <Textarea
            placeholder="What do you want to create?"
            className="w-full h-48 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          {goal && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-16 bottom-4 cursor-pointer"
              onClick={handleClear}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            size={isLoading ? "default" : "icon"}
            className="absolute right-4 bottom-4 cursor-pointer"
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
  );
}

export default ChatBox;
