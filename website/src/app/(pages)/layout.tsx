import "@/app/css/global.css";

import { getUser } from "@/auth";
import { Inter } from "next/font/google";
import AppThemeProvider from "@/app/providers/AppThemeProvider";
import SnackbarProvider from "@/app/providers/SnackbarProvider";
import UserProvider from "@/app/providers/UserProvider";
import LogoutFunctionProvider from "@/app/providers/LogoutFnProvider";
import GloablLoader from "@/app/providers/GlobalLoader";
import ProgressProvider from "@/app/providers/ProgressProvider";
import AuthModalProvider from "../providers/AuthModalProvider";

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
        <AppThemeProvider>
          <ProgressProvider />
          <SnackbarProvider>
            <GloablLoader>
              <LogoutFunctionProvider>
                <AuthModalProvider>
                  <UserProvider initialUserData={user}>
                    <>{children}</>
                  </UserProvider>
                </AuthModalProvider>
              </LogoutFunctionProvider>
            </GloablLoader>
          </SnackbarProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
