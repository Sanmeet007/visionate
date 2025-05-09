export const dynamic = "force-dynamic";

import "@/app/css/global.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { Metadata } from "next";
import FrontLayout from "./front-layout";

export const metadata: Metadata = {
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

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <FrontLayout>
            <>{children}</>
          </FrontLayout>
        </Providers>
      </body>
    </html>
  );
}
