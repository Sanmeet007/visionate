"use client";
import { createContext, useContext, useState } from "react";
import { usersTable } from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

type UserSchema = Omit<InferSelectModel<typeof usersTable>, "hashedPassword">;

export const UserContext = createContext<UserSchema | null>(null);
export const UpdateUserContext = createContext<React.Dispatch<
  React.SetStateAction<UserSchema | null>
> | null>(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const useUserUpdaterContext = () => {
  return useContext(UpdateUserContext);
};

const UserProvider = ({
  children,
  user = null,
}: {
  children: React.ReactNode;
  user: UserSchema | null;
}) => {
  const [currentUser, setUser] = useState(user);

  return (
    <UserContext.Provider value={currentUser}>
      <UpdateUserContext.Provider value={setUser}>
        {children}
      </UpdateUserContext.Provider>
    </UserContext.Provider>
  );
};

export default UserProvider;
