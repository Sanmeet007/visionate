"use client";

import { useUser } from "@/app/providers/UserProvider";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { AccountCircle, Dashboard, Logout } from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import Box from "@mui/material/Box";
import { useLoader } from "@/app/providers/GlobalLoader";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
// import EditOutlinedIcon from "@/app/icons/edit-outlined";
// import { useMobileMenu } from "@/app/providers/MobileMenuProvider";

interface UserMenuState {
  anchorEl: Element | null;
}

const UserMenu = () => {
  const router = useRouter();
  const { user } = useUser();
  const showSnackbar = useSnackbar();
  const { showLoader, hideLoader } = useLoader();

  const [userMenuState, setUserMenuState] = useState<UserMenuState>({
    anchorEl: null,
  });

  const handleLogout = async () => {
    try {
      showLoader();

      const res = await fetch(
        process.env.NEXT_PUBLIC_ORIGIN + "/api/auth/logout",
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        showSnackbar("success", "Logout successfull");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else {
        await res.json();
      }
    } catch (e) {
      console.log(e);
      showSnackbar("error", "Something went wrong!");
    } finally {
      hideLoader();
    }
  };

  const logoutFn = async () => {
    setUserMenuState({ anchorEl: null });
    await handleLogout();
  };

  const openDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    setUserMenuState({ anchorEl: null });
    router.push("/dashboard");
  };
  const openMyAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    setUserMenuState({ anchorEl: null });
    router.push("/dashboard/my-account");
  };
  const closeUserMenu = () => {
    setUserMenuState({ anchorEl: null });
  };
  const openUserMenu = (e: React.MouseEvent) => {
    setUserMenuState({ anchorEl: e.currentTarget });
  };

  const openNewArticleModal = () => {
    setUserMenuState({ anchorEl: null });
  };

  return (
    <>
      {/* {user.role !== "subscriber" && (
        <>
          <PlainButton
            disableElevation
            variant="contained"
            color="inherit"
            size="small"
            sx={{
              borderRadius: "100px",
            }}
            onClick={openNewArticleModal}
          >
            <EditOutlinedIcon color="currentColor" size={20} />

            <Box
              component={"span"}
              sx={{
                mx: "0.5rem",
                textTransform: "none",
                "@media screen and (max-width:600px)": {
                  mx: "0rem",
                },
              }}
            >
              Craft
            </Box>
          </PlainButton>
        </>
      )} */}

      <Box
        sx={{
          display: "flex",
          gap: "0rem",
          "@media screen and (max-width:700px)": {
            "& .hide-600": {
              display: "none",
            },
          },
          "@media screen and (min-width:700px)": {
            "& .hide-min-600": {
              display: "none",
            },
          },
        }}
      >
        <Tooltip
          className="hide-600"
          title={"Hi, " + user!.name}
          arrow
          TransitionComponent={Zoom}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            },
          }}
        >
          <IconButton size="small" onClick={(e) => openUserMenu(e)}>
            <Avatar src={user?.profileImage ?? ""} alt={user?.name ?? ""}>
              {user!.name?.slice(0, 1).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        id="user-menu"
        anchorEl={userMenuState.anchorEl}
        keepMounted
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(userMenuState.anchorEl)}
        onClose={closeUserMenu}
      >
        <MenuItem
          href="/dashboard/my-account"
          component={"a"}
          onClick={(e) => openMyAccount(e)}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          My account
        </MenuItem>
        <MenuItem
          component={"a"}
          href="/dashboard"
          onClick={(e) => openDashboard(e)}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={logoutFn}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
