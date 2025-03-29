"use client";
import { usersTable } from "@/drizzle/schema";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserProviderValue {
  user: typeof usersTable.$inferSelect | null;
  setUser: React.Dispatch<
    React.SetStateAction<typeof usersTable.$inferSelect | null>
  >;
}

const UserContext = createContext<UserProviderValue>({
  user: null,
  setUser: () => {},
});

/**
 * Hook to manage user state
 * - Returns user and setUser functions
 *   - user: Current logged-in user object
 *   - setUser: State updater function
 *
 * @example
 *  export default Component(...) {
 *    const { user, setUser } = useUser();
 *
 *    return (<> {JSON.stringify(user, null, 4)} ...</>)
 *  }
 */
export const useUser = () => {
  return useContext(UserContext);
};

/**
 * User provider
 */
const UserProvider = ({
  children,
  initialUserData = null,
}: {
  children: React.ReactNode;
  initialUserData: typeof usersTable.$inferSelect | null;
}) => {
  const [user, setUser] = useState<typeof usersTable.$inferSelect | null>(
    initialUserData
  );

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export default UserProvider;
