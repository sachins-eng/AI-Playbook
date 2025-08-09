"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AnalyzeContextType {
  userRequest: string;
  apiResult: any;
  currentView: 'input' | 'result';
  playbookData: any;
  setUserRequest: (request: string) => void;
  setApiResult: (result: any) => void;
  setCurrentView: (view: 'input' | 'result') => void;
  setPlaybookData: (data: any) => void;
  clearData: () => void;
}

const AnalyzeContext = createContext<AnalyzeContextType | undefined>(undefined);

export const useAnalyze = () => {
  const context = useContext(AnalyzeContext);
  if (context === undefined) {
    throw new Error("useAnalyze must be used within an AnalyzeProvider");
  }
  return context;
};

interface AnalyzeProviderProps {
  children: ReactNode;
}

export const AnalyzeProvider: React.FC<AnalyzeProviderProps> = ({ children }) => {
  const [userRequest, setUserRequest] = useState<string>("");
  const [apiResult, setApiResult] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'input' | 'result'>('input');
  const [playbookData, setPlaybookData] = useState<any>(null);

  const clearData = () => {
    setUserRequest("");
    setApiResult(null);
    setCurrentView('input');
    setPlaybookData(null);
  };

  const value: AnalyzeContextType = {
    userRequest,
    apiResult,
    currentView,
    playbookData,
    setUserRequest,
    setApiResult,
    setCurrentView,
    setPlaybookData,
    clearData,
  };

  return (
    <AnalyzeContext.Provider value={value}>
      {children}
    </AnalyzeContext.Provider>
  );
};