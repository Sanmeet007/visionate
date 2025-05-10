"use client";

import { ConfirmProvider } from "material-ui-confirm";
import React from "react";

const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ConfirmProvider>{children}</ConfirmProvider>
    </>
  );
};

export default ProvidersWrapper;
