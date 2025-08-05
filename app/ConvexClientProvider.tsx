"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";
import { ReactNode } from "react";
import { AnalyzeProvider } from "@/context/AnalyzeContext";
import Provider from "./provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AnalyzeProvider>
        <Provider>{children}</Provider>
      </AnalyzeProvider>
    </ConvexProvider>
  );
}
