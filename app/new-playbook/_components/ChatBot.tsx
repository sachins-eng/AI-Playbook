'use client'
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

function ChatBox() {
  const onSend = () => {

  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-end mt-2">
          <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-md shadow-md">
            User Message
          </div>
        </div>
        <div className="flex justify-start mt-2">
          <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-md shadow-md">
            AI Message
          </div>
        </div>
      </section>
      {/* Display Input */}
      <section>
        <div className="flex w-full max-w-4xl items-center justify-center">
          <div className="border rounded-2xl p-4 shadow w-full relative">
            <Textarea
              placeholder="What do you want to create?"
              className="w-full h-28 border-none bg-transparent focus-visible:ring-0 shadow-none"
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
      </section>
    </div>
  );
}

export default ChatBox;
