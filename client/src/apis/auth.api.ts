import { JoinProps, LoginProps } from "@/hooks/useAuth";
import { getToken } from "@/stores/authStore";
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

export interface authMessageResponse {
  message: string;
}

export const authLogout = async () => {
  const response = await httpClient.post<authMessageResponse>("/users/logout", {
    headers: {
      Authorization: getToken(),
    },
  });
  return response;
};

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
  const response = await httpClient.patch<authMessageResponse>("/users/reset", data);
  return response;
};

interface profileImageResponse {
  url: string;
}

// 프로필 이미지 먼저 보내기
export const fetchProfileImage = async (data: FormData) => {
  try {
    const response = await httpClient.post<profileImageResponse>("/users/upload/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {}
};

// 프로필 수정 - 닉네임, 이미지랑 같이
interface profileUpdateProps {
  nickname: string | undefined;
  profileImg: string | undefined;
}
export const profileUpdate = async (data: profileUpdateProps) => {
  try {
    const response = await httpClient.patch<authMessageResponse>("/users/me", data);
    return response;
  } catch (error) {
    // 실패
  }
};

// 프로필 수정 - 비밀번호 변경
export interface profileResetProps {
  originPassword: string;
  newPassword: string;
}
export const fetchProfileRestPassword = async (data: profileResetProps) => {
  try {
    const response = await httpClient.patch<authMessageResponse>("/users/me/reset", data);
    return response;
  } catch (error) {
    // 실패
  }
};

//탈퇴
export const fetchUserResign = async () => {
  try {
    const response = await httpClient.delete<authMessageResponse>("/users");
    return response;
  } catch (error) {}
};
