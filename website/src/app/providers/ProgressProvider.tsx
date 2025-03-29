"use client";

import React from "react";
import { AppProgressBar } from "next-nprogress-bar";
import { useTheme } from "@mui/material";

/**
 * Navigation Progress Bar Provider
 * - Handles displaying loading progress bar animation on route changes
 */
const ProgressProvider = () => {
  const theme = useTheme();

  return (
    <>
      <AppProgressBar
        height="3px"
        color={theme.palette.primary.main}
        options={{ showSpinner: false }}
      />
    </>
  );
};

export default ProgressProvider;
