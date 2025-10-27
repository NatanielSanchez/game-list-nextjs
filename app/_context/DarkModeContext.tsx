"use client";

import { createContext, useContext, useEffect, type PropsWithChildren } from "react";
import { useLocalStorageState } from "./_hooks/useLocalStorageState";
type DarkModeContextValue = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

function DarkModeProvider({ children }: PropsWithChildren) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState<boolean>(
    false, // default for SSR
    "isDarkMode"
  );

  const toggleDarkMode = () => {
    setIsDarkMode((darkMode) => !darkMode);
  };

  // on mount, change mode based on user OS
  useEffect(() => {
    // only runs on client
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // check if the OS is in dark mode
    setIsDarkMode(prefersDark);
  }, [setIsDarkMode]);

  // add corresponding class to the HTML element based on state change
  useEffect(() => {
    if (isDarkMode) document.documentElement.className = "dark-mode";
    else document.documentElement.className = "light-mode";
    return () => {
      document.documentElement.className = "";
    };
  }, [isDarkMode]);

  return <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error("DarkModeContext was used outside of the Provider component!");
  return context;
}

export { DarkModeProvider, useDarkMode };
