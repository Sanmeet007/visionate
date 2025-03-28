"use client";

import { ProgressProvider } from "@bprogress/next/app";
import React from "react";

const AppProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProgressProvider
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </>
  );
};

export default AppProgressProvider;
