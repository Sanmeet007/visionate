import ManageApiKeysClientPage from "./client-page";
import ProvidersWrapper from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage API Keys | Visionate",
};

const ManageApiKeysPage = () => {
  return (
    <>
      <ProvidersWrapper>
        <ManageApiKeysClientPage />
      </ProvidersWrapper>
    </>
  );
};

export default ManageApiKeysPage;
