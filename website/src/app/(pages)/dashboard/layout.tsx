import SnackbarProvider from "@/app/providers/SnackbarProvider";
import DashboardLayout from "./base-layout";
import { getUser } from "@/auth";
import { redirect } from "next/navigation";

const getUserData = async () => {
  const user = await getUser();
  return user;
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserData();

  if (!user) {
    redirect("/?action=login");
  }

  if (!user.emailVerified) {
    redirect("/sign-up/verify-email");
  }

  if (!user.onboardingCompleted) {
    redirect("/sign-up/onboarding");
  }

  return (
    <>
      <SnackbarProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </SnackbarProvider>
    </>
  );
};

export default Layout;
