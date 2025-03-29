import { Metadata } from "next";
import ClientHomePage from "./client-page";

export const metadata: Metadata = {
  title: "Homepage",
};

const Homepage = () => {
  return (
    <>
      <ClientHomePage />
    </>
  );
};

export default Homepage;
