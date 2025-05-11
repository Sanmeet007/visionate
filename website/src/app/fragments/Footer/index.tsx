import { GitHub, LinkedIn } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import {Link as MuiLink, Divider} from "@mui/material";
import { Favorite } from "@mui/icons-material";
import Link from "next/link";

const Footer = () => {
  return (
    <>
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
              <Typography variant="caption" component={Link} href="/support">
                Support
              </Typography>
              <Typography variant="caption" component={Link} href="/about">
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
                href={process.env.NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_2 || "/"}
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
                href={process.env.NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_3 || "/"}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
