"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import schoolUnitsData from "@/lib/dummy-data/school_units.json";
import usersData from "@/lib/dummy-data/users.json";

type SchoolUnit = typeof schoolUnitsData[0];
type User = typeof usersData[0];

interface AppContextType {
  activeUnit: SchoolUnit | null;
  setActiveUnit: (unit: SchoolUnit) => void;
  units: SchoolUnit[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  users: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeUnit, setActiveUnit] = useState<SchoolUnit | null>(
    schoolUnitsData.length > 0 ? schoolUnitsData[0] : null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(
    usersData.length > 0 ? usersData[0] : null
  );

  useEffect(() => {
    // State is initialized directly
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeUnit,
        setActiveUnit,
        units: schoolUnitsData,
        currentUser,
        setCurrentUser,
        users: usersData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
