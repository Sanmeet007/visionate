import { getUser } from "@/auth";
import OnboardingClientPage from "./client-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Onboarding | Visionate",
};

const getUserData = async () => {
  const user = await getUser();
  return user;
};

const OnboardingPage = async () => {
  // const user = await getUserData();

  // if (user) {
  //   if (user.emailVerified && user.onboardingCompleted) {
  //     redirect(`/dashboard`);
  //   } else if (!user.emailVerified) {
  //     redirect(`/sign-up/verify-email`);
  //   }
  // }

  return (
    <>
      <OnboardingClientPage />
    </>
  );
};

export default OnboardingPage;
