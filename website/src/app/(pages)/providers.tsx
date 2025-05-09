import AppThemeProvider from "@/app/providers/AppThemeProvider";
import SnackbarProvider from "@/app/providers/SnackbarProvider";
import UserProvider from "@/app/providers/UserProvider";
import LogoutFunctionProvider from "@/app/providers/LogoutFnProvider";
import GloablLoader from "@/app/providers/GlobalLoader";
import ProgressProvider from "@/app/providers/ProgressProvider";
import AuthModalProvider from "@/app/providers/AuthModalProvider";
import QueryProvider from "@/app/providers/QueryProvider";
import MobileMenu from "../fragments/MobileMenu";
import MobileMenuProvider from "../providers/MobileMenuProvider";
import FrontLayout from "./front-layout";

import { getUser } from "@/auth";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();

  return (
    <>
      <QueryProvider>
        <AppThemeProvider>
          <ProgressProvider>
            <SnackbarProvider>
              <GloablLoader>
                <UserProvider initialUserData={user}>
                  <AuthModalProvider>
                    <LogoutFunctionProvider>
                      <MobileMenuProvider>
                        <>{children}</>
                      </MobileMenuProvider>
                    </LogoutFunctionProvider>
                  </AuthModalProvider>
                </UserProvider>
              </GloablLoader>
            </SnackbarProvider>
          </ProgressProvider>
        </AppThemeProvider>
      </QueryProvider>
    </>
  );
};

export default Providers;
