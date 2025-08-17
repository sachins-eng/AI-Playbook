"use client";
import React from "react";
import { usePlaybookDetailsStore } from "@/store/playbookDetailsStore";
import Sidebar from "./_components/sidebar";
import { Button } from "@/components/ui/button";
import { Download, Copy, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { playbookData, hasHydrated } = usePlaybookDetailsStore();

  const handleCopyToClipboard = () => {
    if (playbookData) {
      navigator.clipboard.writeText(JSON.stringify(playbookData, null, 2));
    }
  };

  const handleDownload = () => {
    if (playbookData) {
      const blob = new Blob([JSON.stringify(playbookData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "playbook.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto">
          <div className="h-screen bg-gray-100 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!playbookData) {
    return (
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto">
          <div className="h-screen bg-gray-100 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-6">
                    <FileText className="w-24 h-24 text-gray-300 mx-auto" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No Playbook Data Found
                  </h2>
                  <p className="text-gray-600 mb-4">
                    The playbook data could not be loaded. Please try generating a new playbook.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => window.location.href = "/new-playbook"}
                  >
                    Create New Playbook
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="flex h-screen">
      {/* Sidebar - only shown when playbook data exists */}
      <Sidebar />
      
      <main className="flex-1 overflow-auto lg:ml-20">
        <div className="h-screen bg-gray-100 flex flex-col">
          {/* Header with actions */}
          <div className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800 leading-none">
                {playbookData?.playbook?.name || "Generated Playbook"}
              </h1>
              <Badge variant="outline" className="flex items-center text-base mt-1 border-pink-600">
                {playbookData?.playbook.type}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}