import FrontLayout from "../front-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Visionate",
  description: "Privacy Policy of Visionate",
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <FrontLayout>
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is important to us. This policy explains how we handle
          your information.
        </p>
      </FrontLayout>
    </>
  );
};

export default PrivacyPolicyPage;
