"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

function ChatBox() {
  const onSend = () => {};

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-1 items-center justify-center px-4">
        <div className="mb-6 text-center text-3xl text-neutral-800 dark:text-neutral-200">
          Let's build something awesome
        </div>
        <div className="border rounded-2xl p-4 shadow-md w-full max-w-4xl relative">
          <Textarea
            placeholder="What do you want to create?"
            className="w-full h-40 text-base border-none bg-transparent focus-visible:ring-0 shadow-none resize-none"
          />
          <Button
            size={"icon"}
            className="absolute right-4 bottom-4"
            onClick={() => onSend()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
