import {
  authJoin,
  authLogin,
  authLogout,
  authReset,
  fetchProfileImage,
  fetchProfileRestPassword,
  isEmailUnique,
  isNicknameUnique,
  profileNicknameUpdate,
} from "@/apis/auth.api";
import { httpClient } from "@/apis/https";
import { useAuthStore } from "@/stores/authStore";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";

import { useNavigate } from "react-router-dom";

// 로그인
export interface LoginProps {
  email: string;
  password: string;
}

// 로그인
export interface JoinProps extends LoginProps {
  nickname: string;
}

export const fetchErrorStatusHandler = (error: any, statusList: number[]) => {
  if (statusList.includes(error.response.status)) {
    return error.response;
  } else {
    showAlert(error.data.message, "error");
    return error;
  }
};

export const useAuth = () => {
  const navigate = useNavigate();
  // 상태
  const { storeLogin } = useAuthStore();

  const userLogin = async (data: LoginProps) => {
    try {
      const loginRes = await authLogin(data);
      const newAccessToken = loginRes.headers["authorization"];
      const userName = loginRes.data.nickName;
      const userId = loginRes.data.userId;
      storeLogin(newAccessToken, userName, userId);
      navigate("/");
    } catch (error: any) {
      const errorResponse = error.response;
      showAlert(`${errorResponse.data.message}`, "error");
    }
  };

  const userJoin = async (data: JoinProps) => {
    try {
      const res = await authJoin(data);

      showConfirm(res.message, () => {
        navigate("/login");
      });
    } catch (error: any) {
      return fetchErrorStatusHandler(error, []);
    }
  };

  // const userEmailComfirm = async (email: string) => {
  //   try {
  //     const EmailComfirmRes = await authEmailComfirm(email);
  //     return EmailComfirmRes;
  //   } catch (error: any) {
  //     // 이메일 확인 과정 실패
  //   }
  // };

  const userPasswordReset = async (data: LoginProps) => {
    try {
      const res = await authReset(data);
      showAlert(`${res.data.message}`, "logo");
      return;
    } catch (error: any) {
      return fetchErrorStatusHandler(error, [400]);
    }
  };

  const userNicknameCheck = async (nickname: string) => {
    try {
      const res = await isNicknameUnique({ nickname });
      return res;
    } catch (error: any) {
      return fetchErrorStatusHandler(error, [400, 409]);
    }
  };

  const userEmailCheck = async (email: string) => {
    try {
      const res = await isEmailUnique({ email });
      return res;
    } catch (error: any) {
      return fetchErrorStatusHandler(error, [400, 409]);
    }
  };

  const userLogout = async () => {
    try {
      const res = await authLogout();
      return res;
    } catch (error: any) {}
  };

  const userProfileImage = async (file: File) => {
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("profile", file);
      const res = await httpClient.post("/users/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(res, "response");
      return res;
    } catch (error) {
      // 실패
    }
  };

  const userUpdate = async (data: string) => {
    try {
      const res = await profileNicknameUpdate(data);
      return res;
    } catch (error) {
      //  실패
    }
  };

  const userNewPasswordReset = (originPassword: string, newPassword: string) => {
    try {
      fetchProfileRestPassword({ originPassword, newPassword }).then(() => {
        navigate("/me");
      });
    } catch (error) {}
  };

  return {
    userLogin,
    userJoin,
    userLogout,
    userPasswordReset,
    userNicknameCheck,
    userEmailCheck,
    userUpdate,
    userNewPasswordReset,
    userProfileImage,
  };
};
