import "@/app/css/global.css";

import { getUser } from "@/auth";
import { Inter } from "next/font/google";
import AppThemeProvider from "@/app/providers/AppThemeProvider";
import SnackbarProvider from "@/app/providers/SnackbarProvider";
import UserProvider from "@/app/providers/UserProvider";
import LogoutFunctionProvider from "@/app/providers/LogoutFnProvider";
import GloablLoader from "@/app/providers/GlobalLoader";
import ProgressProvider from "@/app/providers/ProgressProvider";
import AuthModalProvider from "@/app/providers/AuthModalProvider";
import QueryProvider from "@/app/providers/QueryProvider";
import { Metadata } from "next";

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
  const user = await getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AppThemeProvider>
            <ProgressProvider>
              <SnackbarProvider>
                <GloablLoader>
                  <UserProvider initialUserData={user}>
                    <AuthModalProvider>
                      <LogoutFunctionProvider>
                        <>{children}</>
                      </LogoutFunctionProvider>
                    </AuthModalProvider>
                  </UserProvider>
                </GloablLoader>
              </SnackbarProvider>
            </ProgressProvider>
          </AppThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
