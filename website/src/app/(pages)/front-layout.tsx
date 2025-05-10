"use client";

import Link from "next/link";

import { GitHub, LinkedIn, Favorite } from "@mui/icons-material";
import {
  Divider,
  Box,
  Typography,
  Link as MuiLink,
  IconButton,
} from "@mui/material";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../fragments/Header";

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [shouldRenderBaseLayout, setShouldRenderBaseLayout] = useState(false);

  useEffect(() => {
    if (
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/sign-up" ||
      pathname.startsWith("/sign-up/") ||
      pathname === "/sign-up/verify-email" ||
      pathname.startsWith("/sign-up/verify-email/") ||
      pathname === "/reset-password" ||
      pathname.startsWith("/reset-password/") ||
      pathname === "/forgot-password" ||
      pathname.startsWith("/forgot-password/") ||
      pathname === "/sign-up/onboarding" ||
      pathname.startsWith("/sign-up/onboarding/")
    ) {
      setShouldRenderBaseLayout(false);
    } else {
      setShouldRenderBaseLayout(true);
    }
  }, [pathname]);

  if (!shouldRenderBaseLayout) {
    return <>{children}</>;
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
                      href="/support"
                    >
                      Support
                    </Typography>
                    <Typography
                      variant="caption"
                      component={Link}
                      href="/about"
                    >
                      About
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
