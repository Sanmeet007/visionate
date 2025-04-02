import List from "@mui/material/List";
import React from "react";
import { useState } from "react";

import NavItem from "./NavListItem";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export interface NavItemProps {
  text: string;
  href: string;
  icon: React.ReactElement;
}

const NavList = ({
  items,
  activeIndex,
  clickCb = null,
}: {
  items: NavItemProps[];
  activeIndex: number;
  clickCb?: Function | null;
}) => {
  const [previousActiveIndex, setPreviousActiveIndex] = useState(activeIndex);

  return (
    <List role={"navigation"}>
      {items.map((navItem, index) => {
        return (
          <NavItem
            key={"aside-nav-item-" + index}
            index={index}
            active={activeIndex === index}
            text={navItem.text}
            icon={navItem.icon}
            href={navItem.href}
            animationType={
              index === activeIndex
                ? "active"
                : index > activeIndex
                ? "bottom"
                : "top"
            }
            activeAnimationType={
              previousActiveIndex === activeIndex
                ? "active"
                : previousActiveIndex > activeIndex
                ? "bottom"
                : "top"
            }
            onClick={() => {
              setPreviousActiveIndex(activeIndex);

              if (clickCb) {
                clickCb();
              }
            }}
          />
        );
      })}
    </List>
  );
};

export default NavList;
