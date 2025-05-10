import React from "react";
import { Metadata } from "next";
import ResetPasswordClientPage from "./client-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset Password | Visionate",
};

const ResetPasswordPage = ({ searchParams }: { searchParams: any }) => {
  const token = searchParams.token;
  const email = searchParams.m;

  if (!token || !email) {
    return <>400 | BAD REQUEST</>;
  }
  return (
    <>
      <ResetPasswordClientPage token={token} email={email} />
    </>
  );
};

export default ResetPasswordPage;
