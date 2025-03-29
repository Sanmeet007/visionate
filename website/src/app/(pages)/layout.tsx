import { Inter } from "next/font/google";
import AppThemeProvider from "../providers/AppThemeProvider";
import SnackbarProvider from "../providers/SnackbarProvider";

import "../css/global.css";
import UserProvider from "../providers/UserProvider";
import { getUser } from "@/auth";
import LogoutFunctionProvider from "../providers/LogoutFnProvider";
import GloablLoader from "../providers/GlobalLoader";
import ProgressProvider from "../providers/ProgressProvider";

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
                <UserProvider initialUserData={user}>
                  <>{children}</>
                </UserProvider>
              </LogoutFunctionProvider>
            </GloablLoader>
          </SnackbarProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
