"use client";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import toast from "react-hot-toast";

function ReactQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // time until data re-fetch in miliseconds
      },
    },
    queryCache: new QueryCache({
      onError(error) {
        console.error(error.message);
        toast.error(error.message);
      },
    }),
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default ReactQueryProvider;
