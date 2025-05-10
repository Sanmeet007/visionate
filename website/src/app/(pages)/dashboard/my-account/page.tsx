import MyAccountClientPage from "./client-page";
import { Metadata } from "next";
import ProvidersWrapper from "./providers";

export const metadata: Metadata = {
  title: "My Account | Visionate",
};

const MyAccountPage = () => {
  return (
    <>
      <ProvidersWrapper>
        <MyAccountClientPage />
      </ProvidersWrapper>
    </>
  );
};

export default MyAccountPage;
