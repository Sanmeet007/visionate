import ManageApiKeysClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage API Keys | Visionate",
};

const ManageApiKeysPage = () => {
  return (
    <>
      <ManageApiKeysClientPage />
    </>
  );
};

export default ManageApiKeysPage;
