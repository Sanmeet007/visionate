import { Metadata } from "next";
import ApiDocsClientPage from "./client-page";

export const metadata: Metadata = {
  title: "API Documentation | Visionate",
};

const ApiDocsPage = () => {
  return (
    <>
      <ApiDocsClientPage />
    </>
  );
};

export default ApiDocsPage;
