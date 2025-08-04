"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

function ChatBox() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSend = async () => {
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);
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
          Let's build something awesome
        </div>
        <div className="border rounded-2xl p-4 shadow-md w-full max-w-4xl relative">
          <Textarea
            placeholder="What do you want to create?"
            className="w-full h-48 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button
            size={isLoading ? "default" : "icon"}
            className="absolute right-4 bottom-4 cursor-pointer"
            onClick={() => onSend()}
            disabled={isLoading}
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
