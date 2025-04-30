"use client";

import React from "react";
import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app";
import { useTheme } from "@mui/material";

/**
 * Navigation Progress Bar Provider
 * - Handles displaying loading progress bar animation on route changes
 */
const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <>
      <AppProgressProvider
        height="3px"
        color={theme.palette.primary.main}
        options={{ showSpinner: false }}
      >
        {children}
      </AppProgressProvider>
    </>
  );
};

export default ProgressProvider;
