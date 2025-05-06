import SignupForm from "@/app/fragments/SignupForm";
import { getUser } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up | Visionate",
};

const getUserData = async () => {
  const user = await getUser();
  return user;
};

const SignUpPage = async () => {
  const user = await getUserData();
  if (user) {
    if (user.emailVerified) {
      redirect(`/dashboard`);
    } else {
      redirect(`/sign-up/verify-email`);
    }
  }

  return (
    <>
      <SignupForm />
    </>
  );
};

export default SignUpPage;
