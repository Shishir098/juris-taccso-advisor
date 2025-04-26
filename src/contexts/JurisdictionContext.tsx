
import React, { createContext, useState, useEffect, useContext } from "react";
import { jurisdictions, DEFAULT_JURISDICTION, Jurisdiction } from "@/data/jurisdictions";

type JurisdictionContextType = {
  currentJurisdiction: Jurisdiction;
  setJurisdiction: (jurisdictionCode: string) => void;
  isLoading: boolean;
};

const JurisdictionContext = createContext<JurisdictionContextType | undefined>(undefined);

export const JurisdictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentJurisdiction, setCurrentJurisdiction] = useState<Jurisdiction>(() => {
    // Default to the first jurisdiction
    return jurisdictions.find(j => j.code === DEFAULT_JURISDICTION) || jurisdictions[0];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the user's saved jurisdiction preference from localStorage
    const savedJurisdiction = localStorage.getItem("userJurisdiction");
    
    if (savedJurisdiction) {
      const foundJurisdiction = jurisdictions.find(j => j.code === savedJurisdiction);
      if (foundJurisdiction) {
        setCurrentJurisdiction(foundJurisdiction);
      }
    }
    
    setIsLoading(false);
  }, []);

  const setJurisdiction = (jurisdictionCode: string) => {
    const jurisdiction = jurisdictions.find(j => j.code === jurisdictionCode);
    if (jurisdiction) {
      setCurrentJurisdiction(jurisdiction);
      localStorage.setItem("userJurisdiction", jurisdictionCode);
    }
  };

  return (
    <JurisdictionContext.Provider value={{ currentJurisdiction, setJurisdiction, isLoading }}>
      {children}
    </JurisdictionContext.Provider>
  );
};

export const useJurisdiction = (): JurisdictionContextType => {
  const context = useContext(JurisdictionContext);
  if (context === undefined) {
    throw new Error("useJurisdiction must be used within a JurisdictionProvider");
  }
  return context;
};
