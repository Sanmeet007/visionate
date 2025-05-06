import OnboardingClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Visionate",
};

const OnboardingPage = () => {
  return (
    <>
      <OnboardingClientPage />
    </>
  );
};

export default OnboardingPage;
