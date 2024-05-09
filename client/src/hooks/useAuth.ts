import { authEmailComfirm, authJoin, authLogin, authReset, isEmailUnique, isNicknameUnique } from "@/apis/auth.api";
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

export const inputErrorStatusHandler = (error: any, statusList: number[]) => {
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
      storeLogin(loginRes.nickname, loginRes.userId);
      navigate("/");
    } catch (error: any) {
      const errorResponse = error.response;
      showAlert(`${errorResponse.data.message}`, "error");
    }
  };

  const userJoin = async (data: JoinProps) => {
    try {
      const joinRes = await authJoin(data);
      showConfirm(joinRes.message, () => {
        navigate("/login");
      });
    } catch (error: any) {
      return inputErrorStatusHandler(error, []);
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
      const passwordResetRes = await authReset(data);
      return passwordResetRes;
    } catch (error: any) {
      // 비밀번호 리셋 실패
    }
  };

  const userNickCheck = async (nickname: string) => {
    try {
      const checkNicknameRes = await isNicknameUnique({ nickname });
      return checkNicknameRes;
    } catch (error: any) {
      return inputErrorStatusHandler(error, [400, 409]);
    }
  };

  const userEmailCheck = async (email: string) => {
    try {
      const checkEmailRes = await isEmailUnique({ email });
      return checkEmailRes;
    } catch (error: any) {
      return inputErrorStatusHandler(error, [400, 409]);
    }
  };

  return { userLogin, userJoin, userPasswordReset, userNickCheck, userEmailCheck };
};
