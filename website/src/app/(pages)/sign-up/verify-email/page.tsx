import { getUser } from "@/auth";
import VerifyEmailClientPage from "./client-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Your Account | Visionate",
};

const getUserData = async () => {
  const user = await getUser();
  return user;
};

const VerifyEmailPage = async () => {
  const user = await getUserData();

  if (user && user.emailVerified) {
    return redirect(`/dashboard`);
  }

  return (
    <>
      <VerifyEmailClientPage />
    </>
  );
};

export default VerifyEmailPage;
