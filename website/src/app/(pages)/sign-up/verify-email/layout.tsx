import React from "react";
import BareLayout from "../../base-layout";

const VerifyEmailPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BareLayout>{children}</BareLayout>
    </>
  );
};

export default VerifyEmailPageLayout;
