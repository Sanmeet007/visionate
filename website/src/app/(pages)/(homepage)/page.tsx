import { Metadata } from "next";
import ClientHomePage from "./client-page";

export const metadata: Metadata = {
  title: "Visionate - See the unseen",
  description:
    "Experience a more accessible web with our extension that converts images to descriptive text for blind & visually impaired users.",
  keywords: [
    "web accessibility",
    "blind",
    "visually impaired",
    "image to text",
    "extension",
  ],
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
