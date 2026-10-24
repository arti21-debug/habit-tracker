"use client";

import React, { createContext, useContext, useState } from "react";

interface HabitContextType {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  openMenuId: null | string;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <HabitContext.Provider
      value={{ isModalOpen, setIsModalOpen, openMenuId, setOpenMenuId }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabit must be used within HabitProvider");
  return context;
}
