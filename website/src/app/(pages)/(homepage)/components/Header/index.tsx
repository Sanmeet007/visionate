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

// import { useAuthModalOpener } from "@/app/providers/AuthModal";
import { useRouter } from "next-nprogress-bar";
// import { useMobileMenu } from "@/app/providers/MobileMenuProvider";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { useAuthModalOpener } from "@/app/providers/AuthModalProvider";

const Header = () => {
  const pathname = usePathname();
  // const [openMobileMenu] = useMobileMenu();
  const { user } = useUser();

  // const setSettingsContext = useSettingsPanelContextUpdater();
  const openAuthModal = useAuthModalOpener();
  const router = useRouter();

  const openSettingsPanel = () => {
    // setSettingsContext((x) => ({
    //   ...x,
    //   drawerState: true,
    // }));
  };

  const handleLoginMenuOption = (x: string) => () => {
    if (x === "sign-up") {
      if (typeof window !== "undefined") {
        router.push("/sign-up?next=" + window.location.pathname);
      }
    } else if (x === "sign-in") {
      if (openAuthModal) openAuthModal();
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
            bgcolor: colorTrigger ? (theme) => "red" : "transparent",
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
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="#pricing">Pricing</Link>
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

              {/* {(!user || user.role === "subscriber") && (
                <>
                  {pathname !== "/search" && (
                    <>
                      <Tooltip
                        title="Search"
                        sx={{
                          "@media screen and  (min-width:701px)": {
                            display: "none",
                          },
                        }}
                      >
                        <IconButton
                          LinkComponent={Link}
                          href="/search"
                          size="small"
                        >
                          <Search />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </>
              )} */}

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
                  // onClick={openMobileMenu}
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
