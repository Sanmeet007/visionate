import MyAccountClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Visionate",
};

const MyAccountPage = () => {
  return (
    <>
      <MyAccountClientPage />
    </>
  );
};

export default MyAccountPage;
