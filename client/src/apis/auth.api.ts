import { JoinProps, LoginProps } from "@/hooks/useAuth";
import { httpClient } from "./https";

export const authJoin = async (data: JoinProps) => {
  const response = await httpClient.post("/users/join", data);
  return response.data;
};

export interface LoginResponse {
  message: string;
  userId: number;
  nickName: string;
}

export const authLogin = async (data: LoginProps) => {
  const response = await httpClient.post("/users/login", data);
  return response;
};
interface authMessageResponse {
  message: string;
}

// 이메일 중복 확인
export const isEmailUnique = async (data: { email: string }) => {
  const response = await httpClient.post<authMessageResponse>("/users/check/email", data);
  return response;
};

// 닉네임 중복 확인
export const isNicknameUnique = async (data: { nickname: string }) => {
  const response = await httpClient.post<authMessageResponse>("/users/check/nickname", data);
  return response;
};

// 비밀번호 초기화를 위한 이메일 확인
export const authEmailComfirm = async (email: string) => {
  const response = await httpClient.post<authMessageResponse>("/users/reset", email);
  return response;
};

// 비밀번호 초기화
export const authReset = async (data: LoginProps) => {
  const response = await httpClient.put<authMessageResponse>("/users/reset", data);
  return response;
};

// 프로필 수정 - 닉네임 or 이미지랑 같이?
interface profileInfoUpdateProp {
  nickname: string;
  profile: string;
}
export const profileInfoUpdate = async (data: profileInfoUpdateProp) => {
  try {
    const response = await httpClient.put<authMessageResponse>("/users/me", data);
    return response;
  } catch (error) {
    // 실패
  }
};

// 프로필 수정 - 비밀번호 변경
interface profileResetProps {
  originPassword: string;
  newPassword: string;
}
export const fetchProfileRestPassword = async (data: profileResetProps) => {
  try {
    const response = await httpClient.put<authMessageResponse>("/users/me/reset", data);
    return response;
  } catch (error) {
    // 실패
  }
};
