"use client";
import { useState, useEffect } from "react";

export function useLocalStorageState<T>(initialState: T, key: string) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialState; // SSR fallback

    const storedValue = localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue) as T;
    else return initialState as T;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}
