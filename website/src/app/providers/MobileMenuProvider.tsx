"use client";

import React, { createContext, useContext, useState } from "react";
import MobileMenu from "@/app/fragments/MobileMenu";

interface MobileMenuContextType {
  openSiteMenu: () => void;
  closeSiteMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType>({
  openSiteMenu: () => {},
  closeSiteMenu: () => {},
});

export const useMobileMenu = () => {
  return useContext(MobileMenuContext);
};

const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [mainMenuState, setMainMenuState] = useState({
    open: false,
  });

  const openSiteMenu = () => {
    setMainMenuState({ open: true });
  };

  const closeSiteMenu = () => {
    setMainMenuState({ open: false });
  };

  return (
    <>
      <MobileMenuContext.Provider value={{ openSiteMenu, closeSiteMenu }}>
        <MobileMenu
          closeSiteMenu={closeSiteMenu}
          mainMenuState={mainMenuState}
        />
        {children}
      </MobileMenuContext.Provider>
    </>
  );
};

export default MobileMenuProvider;
