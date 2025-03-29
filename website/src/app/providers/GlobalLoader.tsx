"use client";

import { Backdrop, CircularProgress } from "@mui/material";
import { createContext, useContext, useState } from "react";

interface GlobalLoaderContextValues {
  showLoader: () => void;
  hideLoader: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextValues>({
  showLoader: () => {},
  hideLoader: () => {},
});

/**
 * Hook that returns functions to show and hide the loader
 * - showLoader: Function to show the loader
 * - hideLoader: Function to hide the loader
 */
export const useLoader = () => useContext(GlobalLoaderContext);

/**
 *
 * Provides circular progress loader show and hide functions.
 * Use the related context hook > `useLoader`, which returns an object with showLoader and hideLoader functions.
 *
 * @example
 *
 *  export default Component(...) {
 *    ...
 *    const { showLoader, hideLoader } = useLoader();
 *    return (<>...</>)
 *  }
 */
const GloablLoader = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState({
    open: false,
  });
  const showLoader = () => {
    setState({ open: true });
  };

  const hideLoader = () => {
    setState({ open: false });
  };

  return (
    <>
      <GlobalLoaderContext.Provider value={{ showLoader, hideLoader }}>
        <Backdrop
          open={state.open}
          sx={{
            zIndex: 100000,
          }}
        >
          {state.open && <CircularProgress />}
        </Backdrop>
        {children}
      </GlobalLoaderContext.Provider>
    </>
  );
};

export default GloablLoader;
