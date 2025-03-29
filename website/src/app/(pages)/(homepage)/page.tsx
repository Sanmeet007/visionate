import { Metadata } from "next";
import ClientHomePage from "./client-page";

export const metadata: Metadata = {
  title: "Visionate - See the unseen",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon-light.png",
        href: "/favicon-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon-dark.png",
        href: "/favicon-dark.png",
      },
    ],
  },
};

const Homepage = () => {
  return (
    <>
      <ClientHomePage />
    </>
  );
};

export default Homepage;
