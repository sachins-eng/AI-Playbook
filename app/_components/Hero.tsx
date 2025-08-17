'use client'
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Workflow, Cpu, NotebookText, ArrowDown } from "lucide-react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { AuroraText } from "@/components/magicui/aurora-text";

const suggestions = [
  {
    title: "Open new restaurant",
    icon: <Workflow className="text-blue-400 h-5 w-5" />,
  },
  {
    title: "Learn German in 10 days",
    icon: <Cpu className="text-blue-400 h-5 w-5" />,
  },
  {
    title: "Apply for a job",
    icon: <NotebookText className="text-blue-400 h-5 w-5" />,
  },
];

function Hero() {
  const { user } = useUser();

  const router = useRouter();
  const onSend = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    router.push("/new-playbook");
  };

  return (
    <div className="mt-20 flex items-center justify-center">
      {/* content */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-xl md:text-5xl font-bold">
          Create a Playbook for anything{" "}
           <AuroraText>in minutes</AuroraText>
        </h1>
        <p className="text-xl">
          Please tell us what you want and we'll handle the rest : Process,
          Training Plan, Workflow, etc.
        </p>
        {/* textarea  */}
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

        {/* suggestion  */}
        <div className="flex flex-wrap gap-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-full py-2 px-4 cursor-pointer shadow-md hover:bg-primary-foreground transition-all duration-300"
            >
              {suggestion.icon}
              <h2 className="text-sm">{suggestion.title}</h2>
            </div>
          ))}
        </div>

        {/* video  */}
        <h2 className="flex mt-10 text-xl font-bold">
          Not sure what to create?
          <span className="ml-2 mr-2 text-primary"> Watch a video</span>{" "}
          <ArrowDown />
        </h2>
        <div className="px-30 mt-10 flex items-center justify-center">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/TsIN9h07lq0"
            thumbnailSrc="/bg-makebooks.png"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
