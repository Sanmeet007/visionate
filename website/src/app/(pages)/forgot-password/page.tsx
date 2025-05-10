import React from "react";
import { Metadata } from "next";
import ForgotPasswordClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Forgot Password | Visionate",
};

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPasswordClientPage />
    </>
  );
};

export default ForgotPasswordPage;
