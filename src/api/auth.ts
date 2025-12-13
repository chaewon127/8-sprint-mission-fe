import { defaultFetch } from "@/api/fetchClient";
import { LoginProps, LoginResponse, SignupProps } from "@/types/auth";
import { apiClient } from "@/api/apiClient";

export const authService = {
  // 로그인
  login: async ({ email, password }: LoginProps): Promise<LoginResponse> => {
    const res = await defaultFetch<LoginResponse>("/auth/signIn", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return res;
  },

  // 회원가입
  signUp: async ({
    nickname,
    email,
    password,
  }: SignupProps): Promise<LoginResponse> => {
    const res = await defaultFetch<LoginResponse>("/auth/signUp", {
      method: "POST",
      body: JSON.stringify({ nickname, email, password }),
    });

    return res;
  },

  validate: async (token: string) => {
    const res = await apiClient.get("/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
