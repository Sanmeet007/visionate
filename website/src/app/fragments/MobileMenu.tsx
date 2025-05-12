"use client";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Box,
  IconButton,
  Divider,
  List,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Flexbox from "@/app/components/Flexbox";
import {
  AppRegistration,
  Close,
  ContactSupport,
  Diversity1,
  Login,
  Home,
  Search,
  AccountCircle,
  Dashboard,
  LogoutOutlined,
  Category as CategoryIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  DataObject as DataObjectIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuthModalFns } from "@/app/providers/AuthModalProvider";
import { useUser } from "../providers/UserProvider";
import { useState } from "react";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useRouter } from "@bprogress/next/app";

const MobileMenu = ({
  closeSiteMenu,
  mainMenuState,
}: {
  closeSiteMenu: () => void;
  mainMenuState: { open: boolean };
}) => {
  const authFns = useAuthModalFns();
  const { user } = useUser();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const showSnackbar = useSnackbar();

  const handleLogout = async () => {
    closeSiteMenu();
    try {
      setIsProcessing(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_REQUEST_HOST + "/api/auth/logout",
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        showSnackbar("success", "Logout successfull");
        setIsProcessing(false);
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else {
        const data = await res.json();
        setIsProcessing(false);
        showSnackbar("error", data.message);
      }
    } catch (e) {
      console.log(e);
      showSnackbar("error", "Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Backdrop
        open={isProcessing}
        sx={{
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Backdrop>
      <Drawer
        open={mainMenuState.open}
        onClose={closeSiteMenu}
        aria-labelledby={"site-menu"}
        variant="temporary"
        anchor="left"
        PaperProps={{
          sx: {
            border: "none",
            borderTopRightRadius: "20px",
            minWidth: "250px",
            // boxShadow: (theme) => theme.customProps.modalShadow,
          },
        }}
      >
        <Flexbox
          sx={{
            justifyContent: "space-between",
            p: "1rem 1rem 0.8rem 1rem",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Site menu</Typography>

          <Box>
            <IconButton color="secondary" onClick={closeSiteMenu}>
              <Close />
            </IconButton>
          </Box>
        </Flexbox>
        <Divider />
        <List>
          {[
            { label: "Home", icon: Home, href: "/" },
            { label: "Features", icon: CategoryIcon, href: "/#features" },
            { label: "Pricing", icon: CurrencyRupeeIcon, href: "/#pricing" },
            { label: "API Docs", icon: DataObjectIcon, href: "/api-docs" },
            {
              label: "Support",
              icon: ContactSupport,
              href: "/support",
            },
          ].map((item, index) => (
            <ListItem key={"site-menu-item-" + index} disablePadding>
              <ListItemButton
                LinkComponent={Link}
                href={item.href}
                onClick={closeSiteMenu}
              >
                <ListItemIcon>{<item.icon />}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {!user &&
            [
              {
                label: "Sign in",
                icon: Login,
                onClick: () => {
                  closeSiteMenu();
                  if (authFns) {
                    authFns.openAuthModal();
                  }
                },
              },
              {
                label: "Sign up",
                icon: AppRegistration,
                onClick: () => {
                  closeSiteMenu();
                  router.push("/sign-up");
                },
              },
            ].map((item, index) => (
              <ListItem
                key={"site-menu-item-secondary-" + index}
                disablePadding
              >
                <ListItemButton onClick={item.onClick}>
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          {user &&
            [
              {
                label: "Dashboard",
                icon: Dashboard,
                href: "/dashboard",
              },
              {
                label: "My Account",
                icon: AccountCircle,
                href: "/dashboard/my-account",
              },
            ].map((item, index) => (
              <ListItem
                key={"site-menu-item-secondary-" + index}
                disablePadding
              >
                <ListItemButton
                  LinkComponent={Link}
                  href={item.href}
                  onClick={closeSiteMenu}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          {user && <Divider />}
          {user && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleLogout();
                }}
              >
                <ListItemIcon>
                  <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default MobileMenu;
