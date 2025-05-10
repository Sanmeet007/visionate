import React from "react";
import BareLayout from "../base-layout";

const  ResetPasswordPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BareLayout>{children}</BareLayout>
    </>
  );
};

export default ResetPasswordPage;
