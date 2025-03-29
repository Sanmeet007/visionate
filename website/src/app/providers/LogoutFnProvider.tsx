"use client";

import React, { createContext, useContext } from "react";

const LogoutFnContext = createContext<(e?: any) => Promise<void>>(
  async () => {}
);

/**
 * Hook to get the logout function
 * - Provides the logout function to be used in components
 *
 * Note: Errors are not handled by this function
 *
 * @example
 *
 *  export default Component(...) {
 *    ...
 *    const logoutUser = useLogoutFunction();
 *    const handleLogout = async () => {
 *      // showLoader
 *      try{
 *        await logoutUser();
 *        ...
 *      }catch(e){
 *        // show error
 *      }finally{
 *        // hideLoader
 *      }
 *    }
 *
 *    return (<>
 *        <button onClick={handleLogout}>Logout</button>
 *        ...
 *    </>)
 *  }
 */
export const useLogoutFunction = () => useContext(LogoutFnContext);

/**
 * Provides logout function
 * Use the related context hook > `useLogoutFunction` to get the function
 *
 * Note: Errors are not handled by this function
 */
const LogoutFunctionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const handleLogout = async (e: any) => {
    e?.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/logout`, {
        credentials: "include",
      });
      window.location.reload();
    } catch (e) {
      throw e;
    }
  };

  return (
    <LogoutFnContext.Provider value={handleLogout}>
      {children}
    </LogoutFnContext.Provider>
  );
};

export default LogoutFunctionProvider;
