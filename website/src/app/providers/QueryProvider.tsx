"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NEXT_PUBLIC_DISABLE_REACT_QUERY_DEV_TOOLS === "false" && (
          <ReactQueryDevtools />
        )}
      </QueryClientProvider>
    </>
  );
};

export default QueryProvider;
