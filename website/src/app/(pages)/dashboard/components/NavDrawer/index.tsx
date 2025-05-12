"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import Image from "next/image";
import ProfileImage from "./ProfileImage";
import lodash from "lodash";
import NavList, { NavItemProps } from "./NavList";
import Link from "next/link";

import { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import { Close, Logout as LogoutIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import LogoImage from "@/app/icons/logo-full";
import { useRouter } from "@bprogress/next/app";

interface ApiResponse {
  severity: AlertColor;
  showResponse: boolean;
  message: string;
}

const emptyResponse = {
  severity: "success",
  showResponse: false,
  message: "",
} as ApiResponse;

const NavDrawer = ({
  activeIndex = 0,
  navItems = [],
  navBarState = false,
  setNavBarState = null,
}: {
  activeIndex: number;
  navItems: NavItemProps[];
  navBarState: boolean;
  setNavBarState: Function | null;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisbaled, setIsDisabled] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse>(emptyResponse);

  const handleLogout = async () => {
    try {
      setIsProcessing(true);
      setIsDisabled(true);

      const res = await fetch(
        process.env.NEXT_PUBLIC_ORIGIN + "/api/auth/logout",
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        setApiResponse({
          severity: "success",
          showResponse: true,
          message: "Logout successfull",
        });
        setIsDisabled(true);
        setIsProcessing(false);
        redirect();
      } else throw Error(res.statusText);
    } catch (e) {
      setApiResponse({
        severity: "error",
        showResponse: true,
        // message: e?.message ?? "Something went wrong",
        message: "Something went wrong",
      });
      setIsDisabled(false);
      setIsProcessing(false);
    }
  };

  const closeApiResponse = () => {
    setApiResponse(emptyResponse);
  };
  const redirect = () => {
    if (window !== undefined) {
      window.location.reload();
    }
  };

  const closeNavBar = () => {
    if (setNavBarState != null) setNavBarState(false);
  };

  return (
    <>
      <Snackbar
        open={apiResponse.showResponse}
        autoHideDuration={3000}
        onClose={closeApiResponse}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={apiResponse.severity ?? "info"}
          sx={{ width: "100%" }}
          onClose={closeApiResponse}
        >
          {apiResponse.message}
        </Alert>
      </Snackbar>

      <Box
        component={"aside"}
        sx={{
          bgcolor: "#0a0035",
          gridArea: "Aside",
          display: "flex",
          flexDirection: "column",
          gap: "0.1rem",
          alignItems: "center",
          overflowY: "hidden",
          height: "100vh",
          scrollbarGutter: "stable both-edges",
          "&:hover": {
            overflowY: "overlay",
          },
          "@media screen and (max-width: 1000px)": {
            width: "6rem",
            // overflow: "hidden",
            "& .vis-logo-img": {
              height: "40px",
              "& svg": {
                width: "100%",
                height: "100%",
              },
            },
            "& .vis-profile-image": {
              "& .vis-profile-avatar": {
                width: "3.1rem",
                height: "3.1rem",
              },
              "& svg": {
                width: "3.3rem",
                height: "3.1rem",
              },
            },
            "& .vis-role-text": {
              display: "none",
            },
            "& .vis-user-detail-box": {
              display: "none",
            },
            "& .vis-nav-list-wrapper": {
              marginBlock: 0,
            },
            "& .vis-nav-list-item": {
              flexDirection: "column",
              my: "0.7rem",
              p: "0.5rem",
              gap: "0.2rem",
              textAlign: "center",
              alignItems: "center",
              "& .vis-list-item-text": {
                fontSize: "0.7em",
              },
              "& > .vis-list-item-icon": {
                m: 0,
                minWidth: "24px",
                scale: "1.2",
              },
            },
            "& .vis-logout-btn": {
              flexDirection: "column",
              minWidth: "auto",
              minHeight: "2rem",
              "& *": {
                margin: 0,
              },
              "& .vis-logout-btn-text": {
                display: "none",
              },
            },
          },
        }}
      >
        <Box marginBlock={"0.5rem"} className={"vis-logo-img"}>
          <Link href="/">
            <LogoImage width={100} height={60} />
          </Link>
        </Box>
        {pathname !== "/dashboard/my-account" && (
          <>
            <ProfileImage
              src={user?.profileImage ?? ""}
              altText={user?.name ?? ""}
            ></ProfileImage>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBlock: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
              className={"vis-nav-list-wrapper"}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "0.2rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
                className={"vis-user-detail-box"}
              >
                <Typography fontSize={"1.1em"} className="vis-username">
                  {Boolean(user?.emailVerified) && (
                    <Tooltip title="Verified">
                      <Image
                        style={{
                          transform: "translate(-19% , 16%)",
                        }}
                        src="https://res.cloudinary.com/dphuxokhq/image/upload/v1711801384/verified_kzp1ap.png"
                        width={20}
                        height={20}
                        alt={"verified"}
                      ></Image>
                    </Tooltip>
                  )}
                  {`${user?.name}`}
                </Typography>
              </Box>
              <Typography
                className="vis-role-text"
                variant="subtitle2"
                // sx={{
                //   color: theme.customProps.subtitleColor,
                // }}
              >
                {lodash.startCase(user?.subscriptionType)}
              </Typography>
            </Box>
          </>
        )}
        <Box
          sx={{
            marginBottom: "1rem",
          }}
        >
          <NavList
            activeIndex={activeIndex}
            items={navItems}
            clickCb={closeNavBar}
          />
        </Box>

        <Box
          sx={{
            marginTop: "auto",
            marginBottom: "2rem",
          }}
        >
          <LoadingButton
            sx={{
              borderRadius: 100,
            }}
            className="vis-logout-btn"
            disableElevation
            loading={isProcessing}
            disabled={isDisbaled || isProcessing}
            onClick={handleLogout}
            variant="contained"
            startIcon={!isProcessing ? <LogoutIcon /> : null}
          >
            <span className="vis-logout-btn-text">Logout</span>
          </LoadingButton>
        </Box>
      </Box>

      <Drawer
        variant="temporary"
        open={navBarState}
        onClose={closeNavBar}
        PaperProps={{
          sx: {
            border: "none",
            minWidth: "350px",
            borderTopLeftRadius: "20px",
            "@media screen and (max-width: 600px)": {
              minWidth: "auto",
              maxWidth: "280px",
              overflow: "scroll",
            },
          },
        }}
      >
        <Box sx={{ top: "0.5rem", right: "0.5rem", position: "absolute" }}>
          <IconButton size="small" onClick={closeNavBar} color="primary">
            <Close />
          </IconButton>
        </Box>
        <Box
          component={"aside"}
          sx={{
            gridArea: "Aside",
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
            alignItems: "center",
            overflowY: "hidden",
            height: "100vh",
            scrollbarGutter: "stable both-edges",
            "&:hover": {
              overflowY: "overlay",
            },
            p: "1rem",
            bgcolor: "#0a0035",
          }}
        >
          <Box marginBlock={"0.5rem"} className={"vis-logo-img"}>
            <Link href="/" onClick={closeNavBar}>
              <LogoImage width={100} height={60} />
            </Link>
          </Box>
          {pathname !== "/dashboard/my-account" && (
            <>
              <ProfileImage
                src={user?.profileImage ?? ""}
                altText={user?.name ?? ""}
              ></ProfileImage>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginBlock: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className={"vis-nav-list-wrapper"}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "0.2rem",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  className={"vis-user-detail-box"}
                >
                  <Typography fontSize={"1.1em"} className="vis-username">
                    {Boolean(user?.emailVerified) && (
                      <Tooltip title="Verified">
                        <Image
                          style={{
                            transform: "translate(-19% , 16%)",
                          }}
                          src="https://res.cloudinary.com/dphuxokhq/image/upload/v1711801384/verified_kzp1ap.png"
                          width={20}
                          height={20}
                          alt={"verified"}
                        ></Image>
                      </Tooltip>
                    )}
                    {`${user?.name}`}
                  </Typography>
                </Box>
                <Typography
                  className="vis-role-text"
                  variant="subtitle2"
                  //   sx={{
                  //     color: theme.customProps.subtitleColor,
                  //   }}
                >
                  {lodash.startCase(user?.subscriptionType)}
                </Typography>
              </Box>
            </>
          )}
          <Box
            sx={{
              marginBottom: "1rem",
            }}
          >
            <NavList
              activeIndex={activeIndex}
              items={navItems}
              clickCb={closeNavBar}
            />
          </Box>

          <Box
            sx={{
              marginTop: "auto",
              marginBottom: "2rem",
            }}
          >
            <LoadingButton
              sx={{
                borderRadius: 100,
              }}
              className="vis-logout-btn"
              disableElevation
              loading={isProcessing}
              disabled={isDisbaled || isProcessing}
              onClick={handleLogout}
              variant="outlined"
              color="inherit"
              startIcon={!isProcessing ? <LogoutIcon /> : null}
            >
              <span className="vis-logout-btn-text">Logout</span>
            </LoadingButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavDrawer;
