import { Metadata } from "next";
import ApiDocsClientPage from "./client-page";
import FrontLayout from "../front-layout";

export const metadata: Metadata = {
  title: "API Documentation | Visionate",
};

const ApiDocsPage = () => {
  return (
    <>
      <FrontLayout>
        <ApiDocsClientPage />
      </FrontLayout>
    </>
  );
};

export default ApiDocsPage;
