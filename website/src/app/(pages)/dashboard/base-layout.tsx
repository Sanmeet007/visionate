"use client";

import Box from "@mui/material/Box";
import KeyIcon from "@mui/icons-material/Key";
import React, { useContext, useMemo, useState, createContext } from "react";
import { usePathname } from "next/navigation";
import {
  Dashboard as DashboardIcon,
  AccountCircle as MyAccountIcon,
} from "@mui/icons-material";
import NavDrawer from "./components/NavDrawer";
import { NavItemProps } from "./components/NavDrawer/NavList";
import { useUser } from "@/app/providers/UserProvider";
import Background from "./components/Background";

const NavDrawerOpener = createContext<React.Dispatch<
  React.SetStateAction<boolean>
> | null>(null);

export const useNavDrawerOpener = () => {
  return useContext(NavDrawerOpener);
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const pathname = usePathname();

  const [navBarState, setNavBarState] = useState(false);

  const getUserbasedNav = useMemo<NavItemProps[]>(() => {
    if (user?.role === "customer") {
      return [
        {
          text: "Dashboard",
          href: "/dashboard",
          icon: <DashboardIcon />,
        },
        {
          text: "My Account",
          href: "/dashboard/my-account",
          icon: <MyAccountIcon />,
        },
        {
          text: "API Keys",
          href: "/dashboard/discover",
          icon: <KeyIcon />,
        },
      ];
    } else return [];
  }, [user]);

  const getActiveIndex = useMemo(() => {
    if (user?.role === "customer") {
      switch (pathname) {
        case "/dashboard":
          return 0;
        case "/dashboard/discover":
          return 1;
        case "/dashboard/my-account":
          return 2;
        case "/dashboard/manage-network":
          return 3;
        default:
          return -1;
      }
    } else return -1;
  }, [pathname, user]);

  const openNavBar = () => {
    setNavBarState(true);
  };

  return (
    <>
      <Box>
        <Box
          className="constrained-container"
          sx={{
            "@media screen and (max-width: 1000px)  and (min-width: 601px)": {
              gridTemplateColumns: "6rem 1fr",
            },
            "@media screen and (max-width: 600px)": {
              gridTemplateColumns: "1fr",
            },

            display: "grid",
            position: "relative",
            isolation: "isolate",
            minHeight: "100vh",
            gridTemplateColumns: "12.25rem 1fr",
            gridTemplateAreas: `
            "Aside Content"`,
          }}
        >
          <Background />
          <NavDrawer
            activeIndex={getActiveIndex}
            navItems={getUserbasedNav}
            navBarState={navBarState}
            setNavBarState={setNavBarState}
          />
          <Box
            sx={{
              height: "100vh",
              overflow: "auto",
              "@media screen and (min-width:600px)": {
                gridArea: "Content",
              },
            }}
            id="scrollable-element"
          >
            <NavDrawerOpener.Provider value={openNavBar}>
              {children}
            </NavDrawerOpener.Provider>
          </Box>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
