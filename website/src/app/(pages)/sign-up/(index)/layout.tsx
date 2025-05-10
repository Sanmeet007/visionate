import React from "react";
import BareLayout from "../../base-layout";

const SignUpPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BareLayout>{children}</BareLayout>
    </>
  );
};

export default SignUpPageLayout;
