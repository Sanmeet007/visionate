import VerifyEmailClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Account | Visionate",
};

const VerifyEmailPage = () => {
  return (
    <>
      <VerifyEmailClientPage />
    </>
  );
};

export default VerifyEmailPage;
