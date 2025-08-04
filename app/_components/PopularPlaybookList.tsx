"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/playbook-cards-carousel";
import { desc } from "motion/react-client";

function PopularPlaybookList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  
  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Let's us check out some of the most popular playbooks..
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

// Update DummyContent to accept description as a prop
const DummyContent = ({ description } : { description: string }) => {
  return (
    <div
      className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
    >
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};

// Approach 2: Most dynamic - remove content property and generate it automatically
const rawData = [
  {
    category: "Workflow",
    title: "New Employee Onboarding Plan",
    description:
      "A step-by-step onboarding workflow covering HR formalities, IT setup, training, and first-week goals for new hires.",
    src: "https://images.unsplash.com/photo-1686771416282-3888ddaf249b?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Checklist",
    title: "Product Launch Checklist",
    description:
      "A comprehensive checklist to ensure every aspect of a successful product launch is tracked, completed, and reviewed",
    src: "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Process",
    title: "Remote Work Policy Implementation",
    description:
      "A step-by-step guide to implementing a remote work policy, including communication strategies, employee expectations, and tools for remote collaboration.",
    src: "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Travel Itinerary",
    title: "7-Day Thailand Travel Itinerary",
    description:
      "A curated itinerary for exploring Thailand with recommended activities, travel tips, and day-by-day plans.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Training Plan",
    title: "AI/ML Upskilling Training Plan",
    description:
      "A structured learning roadmap for professionals to master AI and Machine Learning concepts over six weeks.",
    src: "https://images.unsplash.com/photo-1561616612-e2398d7ec6a8?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Workflow",
    title: "Incident Management Workflow",
    description:
      "A clear workflow to handle IT incidents from logging to resolution, including escalation paths and SLAs.",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Dynamically generate data with content based on description
const data = rawData.map(item => ({
  ...item,
  content: <DummyContent description={item.description} />
}));

export default PopularPlaybookList;