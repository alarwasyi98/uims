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
  const [activeUnit, setActiveUnit] = useState<SchoolUnit | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Default to first user and first unit
    if (usersData.length > 0) {
      setCurrentUser(usersData[0]);
    }
    if (schoolUnitsData.length > 0) {
      setActiveUnit(schoolUnitsData[0]);
    }
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
