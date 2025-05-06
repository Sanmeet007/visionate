import SignupForm from "@/app/fragments/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Visionate",
};

const SignUpPage = () => {
  return (
    <>
      <SignupForm />
    </>
  );
};

export default SignUpPage;
