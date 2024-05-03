import { JoinProps, LoginProps } from "@/hooks/useAuth";
import { httpClient } from "./https";

export const authJoin = async (data: JoinProps) => {
  const response = await httpClient.post("/api/users/join", data);
  return response.data;
};

interface LoginResponse {
  userId: string;
  nickname: string;
  Authorization: string;
}

export const authLogin = async (data: LoginProps) => {
  const response = await httpClient.post<LoginResponse>("api/users/login", data);
  return response.data;
};
