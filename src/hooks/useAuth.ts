import { useState } from "react";
import { authService } from "@/api/auth";
import { User, LoginProps, LoginResponse, SignupProps } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const login = async (props: LoginProps): Promise<User | null> => {
    const res: LoginResponse = await authService.login(props);

    // 백엔드 응답에서 user만 추출
    if (!res.user) return null;

    setUser(res.user);

    localStorage.setItem("accessToken", res.accessToken ?? "");
    // localStorage.setItem("refreshToken", res.refreshToken ?? "");

    return res.user;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
  };

  const signUp = async (props: SignupProps): Promise<void> => {
    await authService.signUp(props);
  };

  const updateUser = async (formData: Partial<User>): Promise<void> => {
    if (!user) return;
    setUser({ ...user, ...formData });
  };

  return {
    user,
    login,
    logout,
    signUp,
    updateUser,
  };
}
