"use client";
import LogoImage from "@/app/icons/logo-full";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import { Menu, Search, Settings } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import UserMenu from "./UserMenu";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import lodash from "lodash";
import { useRouter } from "@bprogress/next/app";
import { useUser } from "@/app/providers/UserProvider";
import { useAuthModalFns } from "@/app/providers/AuthModalProvider";
import { useMobileMenu } from "@/app/providers/MobileMenuProvider";

const Header = () => {
  const { openSiteMenu } = useMobileMenu();
  const { user } = useUser();
  const authModalfns = useAuthModalFns();
  const router = useRouter();

  const handleLoginMenuOption = (x: string) => () => {
    if (x === "sign-up") {
      if (typeof window !== "undefined") {
        router.push("/sign-up?next=" + window.location.pathname);
      }
    } else if (x === "sign-in") {
      if (authModalfns) authModalfns.openAuthModal();
    }
  };

  const [currentTarget, setCurrentTarget] = useState<Element | null>(null);

  const trigger = useScrollTrigger(
    lodash.omitBy(
      {
        target: currentTarget,
      },
      lodash.isNil
    )
  );
  const colorTrigger = useScrollTrigger(
    lodash.omitBy(
      {
        target: currentTarget,
        disableHysteresis: true,
        threshold: 0,
      },
      lodash.isNil
    )
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setCurrentTarget(document.querySelector("#scrollable-element"));
    }
  }, []);

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <Box
          id="home-appbar-fixed"
          component={"header"}
          sx={{
            px: "2rem",
            "@media screen and (max-width: 700px)": {
              px: "1rem",
            },
            bgcolor: colorTrigger
              ? (theme) => "rgb(35 31 57 / 41%)"
              : "transparent",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: "2",
            backdropFilter: colorTrigger ? "blur(10px)" : "none",
          }}
        >
          <Box
            className="container"
            sx={{
              display: "flex",
              height: "calc(70px + 1rem)",
              pt: !colorTrigger ? "1rem" : "0rem",
              transition: "padding 200ms ease",
              alignItems: "center",
              gap: "2rem",
              justifyContent: "space-between",
              "& .home-link": {
                display: "block",
              },
              "@media screen and (max-width: 850px)": {
                "& .mobile-hidden": {
                  display: "none",
                },
              },
            }}
          >
            <Box component={Link} href="/" className="home-link">
              <LogoImage width={120} height={80} />
            </Box>

            <Box
              component={"nav"}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                "@media screen and (max-width:851px)": {
                  gap: "0.5rem",
                },
              }}
            >
              <Box
                component={"ul"}
                className="mobile-hidden"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                  m: 0,
                  p: 0,
                  mr: "1rem",
                  "& li": {
                    listStyle: "none",
                    "& a": {
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    },
                  },
                }}
              >
                <li>
                  <Link href="/#features">Features</Link>
                </li>
                <li>
                  <Link href="/#pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/api-docs">API Docs</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
              </Box>
              {user && (
                <>
                  <UserMenu />
                </>
              )}

              {!user && (
                <>
                  <Button
                    className="mobile-hidden"
                    disableElevation
                    variant="outlined"
                    color="inherit"
                    onClick={handleLoginMenuOption("sign-up")}
                  >
                    Create Account
                  </Button>
                  <Button
                    className="mobile-hidden"
                    disableElevation
                    variant="contained"
                    onClick={handleLoginMenuOption("sign-in")}
                  >
                    Sign in
                  </Button>
                </>
              )}
              
              <Tooltip
                title="Menu"
                arrow
                enterDelay={800}
                sx={{
                  "@media screen and  (min-width:851px)": {
                    display: "none",
                  },
                }}
              >
                <IconButton
                  aria-label="Site Menu"
                  size="small"
                  onClick={openSiteMenu}
                >
                  <Menu />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default Header;
