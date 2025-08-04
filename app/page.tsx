import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Hero from "./_components/Hero";
import PopularPlaybookList from "./_components/PopularPlaybookList";

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularPlaybookList /> 
    </div>
  );
}
