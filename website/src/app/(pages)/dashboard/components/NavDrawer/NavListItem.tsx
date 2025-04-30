import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const NavListItem = ({
  text,
  index,
  animationType = null,
  active = false,
  href = "#",
  activeAnimationType = null,
  icon,
  onClick = undefined,
}: {
  text: string;
  index: number;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  animationType: string | null;
  activeAnimationType: "active" | "bottom" | "top" | null;
  active: boolean;
  href: string;
  icon?: React.ReactElement;
}) => {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{ borderRadius: "4px" }}
      LinkComponent={Link}
      href={href}
      className="ink-nav-list-item"
    >
      <Box
        component={"div"}
        className={animationType || ""}
        sx={{
          bgcolor: "#ded3ff",
          width: "0.19rem",
          height: "70%",
          borderRadius: "10px",
          position: "absolute",
          left: "0",
          transition: "height 300ms ease",
          "&.top": {
            height: "0",
            bottom: "15%",
          },
          "&.active": {
            bottom: activeAnimationType === "bottom" ? "15%" : null,
            top: activeAnimationType === "top" ? "15%" : null,
          },
          "&.bottom": {
            height: "0",
            top: "15%",
          },
        }}
      ></Box>

      <ListItemIcon
        sx={{ minWidth: "1.875rem" }}
        className="ink-list-item-icon"
      >
        {icon}
      </ListItemIcon>
      <Typography
        // color={color}
        className="ink-list-item-text"
      >
        {text}
      </Typography>
    </ListItemButton>
  );
};

export default NavListItem;
