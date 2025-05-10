"use client";
import { ConfirmProvider } from "material-ui-confirm";

const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ConfirmProvider>{children}</ConfirmProvider>
    </>
  );
};

export default ProvidersWrapper;
