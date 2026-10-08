"use client";

import { createContext, useContext, useState } from "react";

interface HabitContextType {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <HabitContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabit must be used within HabitProvider");
  return context;
}