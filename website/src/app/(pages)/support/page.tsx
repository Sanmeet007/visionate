import { Metadata } from "next";
import SupportClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Support | Visionate",
  description: "Get help and support for your queries.",
};

const SupportPage = () => {
  return (
    <>
      <SupportClientPage />
    </>
  );
};

export default SupportPage;
