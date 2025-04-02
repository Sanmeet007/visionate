
import SnackbarProvider from "@/app/providers/SnackbarProvider";
import DashboardLayout from "./base-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SnackbarProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </SnackbarProvider>
    </>
  );
};

export default Layout;
