"use client";

import { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { ReactNodeType } from "@/types/common";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }: ReactNodeType) {
  const auth = useAuth(); // user, accessToken, refreshToken, login, logout, signUp, updateUser 등 반환

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
