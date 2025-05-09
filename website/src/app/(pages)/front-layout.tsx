"use client";

import Link from "next/link";

import { GitHub, LinkedIn, Favorite } from "@mui/icons-material";
import { Divider , Box, Typography, Link as MuiLink, IconButton } from "@mui/material";

import { useAuthModalFns } from "@/app/providers/AuthModalProvider";
import { useUser } from "@/app/providers/UserProvider";
import { useMobileMenu } from "../providers/MobileMenuProvider";
import { usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSnackbar } from "../providers/SnackbarProvider";
import Header from "../fragments/Header";

interface UserMenuState {
  anchorEl: HTMLElement | null;
}

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  const showSnackbar = useSnackbar();
  const { openSiteMenu } = useMobileMenu();
  const authFns = useAuthModalFns();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [shouldRenderBaseLayout, setShouldRenderBaseLayout] = useState(false);

  useEffect(() => {
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      setShouldRenderBaseLayout(false);
    } else {
      setShouldRenderBaseLayout(true);
    }
  }, [pathname]);

  const [shouldDisable, setShouldDisable] = useState(false);
  const [userMenuState, setUserMenuState] = useState<UserMenuState>({
    anchorEl: null,
  });

  const openDashboard = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setUserMenuState({ anchorEl: null });
    router.push("/dashboard");
  };

  const openMyAccount = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setUserMenuState({ anchorEl: null });
    router.push("/dashboard/my-account");
  };

  const closeUserMenu = () => {
    setUserMenuState({ anchorEl: null });
  };

  const openUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    setUserMenuState({ anchorEl: e.currentTarget });
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleLogout = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_ORIGIN + "/api/auth/logout",
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
      showSnackbar("error", "Something went wrong");
      setIsProcessing(false);
    }
  };
  const logoutFn = async () => {
    setUserMenuState({ anchorEl: null });
    await handleLogout();
  };

  const handleLoginMenuOption = (x: string) => () => {
    if (x === "sign-up") {
      if (typeof window !== "undefined") {
        router.push("/sign-up?next=" + window.location.pathname);
      }
    } else if (x === "sign-in") {
      if (authFns) authFns.openAuthModal();
    }
  };

  if (!shouldRenderBaseLayout) {
    <>{children}</>;
  } else {
    return (
      <>
        <Box className="constrained-container">
          <Box
            sx={{
              scrollbarGutter: "stable both-edges",
            }}
          >
            <Header />
            <Box
              component={"main"}
              sx={{
                px: "2rem",
                minHeight: "calc(100vh - 80px - 160px) ",
              }}
            >
              {pathname !== "/" && (
                <Box
                  sx={{
                    mt: "calc(70px + 1rem)",
                  }}
                ></Box>
              )}

              {children}
            </Box>

            <Box
              component={"footer"}
              sx={{
                mt: "2rem",
                // bgcolor: (
                //   /** @type {import("../themeing").CustomThemeProps} */ theme
                // ) => theme.customProps.bgcolor,
                borderRadius: "30px 30px  0 0 ",
                "& a": {
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: "calc(100% - 2rem)",
                  mx: "auto",
                  p: "1rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    "@media screen and (max-width : 650px)": {
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                      gap: "0.3rem",
                    },
                  }}
                >
                  <Box
                    component={"nav"}
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      "& li": {
                        listStyle: "none",
                        p: "0",
                      },
                      "@media screen and (max-width : 650px)": {
                        mx: "auto",
                      },
                    }}
                  >
                    <Typography variant="caption" component={Link} href="/">
                      Home
                    </Typography>
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/contact-us"
                    >
                      Contact Us
                    </Typography>
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/our-story"
                    >
                      Our Story
                    </Typography>
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/articles"
                    >
                      Articles
                    </Typography>
                  </Box>
                  <Box
                    component={"nav"}
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      "& li": {
                        listStyle: "none",
                        p: "0",
                      },
                      "@media screen and (max-width : 650px)": {
                        mx: "auto",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/terms-of-use"
                    >
                      Terms of Use
                    </Typography>
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Typography>
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/sitemap.xml"
                    >
                      Sitemap
                    </Typography>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    my: "1rem",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",

                    "@media screen and (max-width : 650px)": {
                      flexDirection: "column",
                      textAlign: "center",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "0.3rem",
                      "@media screen and (max-width : 650px)": {
                        flexDirection: "column",
                        textAlign: "center",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="InactiveCaptionText"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                        "& a": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      © {`${new Date().getFullYear()}   Created with`}
                      <Favorite
                        fontSize="inherit"
                        sx={{
                          color: "red",
                        }}
                      />
                      {` by`}{" "}
                      <MuiLink
                        href={process.env.NEXT_PUBLIC_WEB_DEV_URL ?? "/"}
                        component={Link}
                        sx={{
                          color: "currentColor !important",
                          transition: "color 200ms ease",
                          "&:active": {
                            // color: (
                            //   /** @type  {import("../themeing").CustomThemeProps} */ theme
                            // ) => theme.customProps.color + " !important",
                          },
                        }}
                      >
                        {process.env.NEXT_PUBLIC_WEB_DEV_NAME}
                      </MuiLink>
                    </Typography>
                    <Typography
                      variant="caption"
                      color="InactiveCaptionText"
                    >{` All rights are reserved`}</Typography>
                  </Box>
                  <Box>
                    <IconButton
                      title="github"
                      size="small"
                      sx={{
                        color: "InactiveCaptionText !important",
                      }}
                      LinkComponent={Link}
                      href={
                        process.env.NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_2 ?? "/"
                      }
                    >
                      <GitHub fontSize="small" />
                    </IconButton>
                    <IconButton
                      title="linkedin"
                      size="small"
                      sx={{
                        color: "InactiveCaptionText !important",
                      }}
                      LinkComponent={Link}
                      href={
                        process.env.NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_3 ?? "/"
                      }
                    >
                      <LinkedIn fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
};

export default FrontLayout;
