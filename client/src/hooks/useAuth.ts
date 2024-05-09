import { LoginResponse, authEmailComfirm, authJoin, authLogin, authReset, isNicknameUnique } from "@/apis/auth.api";
import { useAuthStore } from "@/stores/authStore";
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

export const useAuth = () => {
  const navigate = useNavigate();
  // 상태
  const { storeLogin } = useAuthStore();

  const userLogin = async (data: LoginProps) => {
    try {
      const loginRes = await authLogin(data);
      storeLogin(loginRes.nickname, loginRes.userId);
      navigate("/");
    } catch (error) {
      // 로그인 실패
    }
  };

  const userJoin = async (data: JoinProps) => {
    try {
      const joinRes = await authJoin(data);
      navigate("/login");
    } catch (error) {
      // 회원가입 실패
    }
  };

  const userEmailComfirm = async (email: string) => {
    try {
      const EmailComfirmRes = await authEmailComfirm(email);
      return EmailComfirmRes;
    } catch (error) {
      // 이메일 확인 과정 실패
    }
  };

  const userPasswordReset = async (data: LoginProps) => {
    try {
      const passwordResetRes = await authReset(data);
      return passwordResetRes;
    } catch (error) {
      // 비밀번호 리셋 실패
    }
  };

  const userNickCheck = async (nickname: string) => {
    try {
      const checkNicknameRes = await isNicknameUnique({ nickname });
      return checkNicknameRes;
    } catch (error) {
      // 닉네임 중복 확인 실패
    }
  };

  const userEmailCheck = async (email: string) => {
    try {
      const checkEmailRes = await authEmailComfirm(email);
      return checkEmailRes;
    } catch (error) {
      // 이메일 중복 확인 실패
    }
  };

  return { userLogin, userJoin, userEmailComfirm, userPasswordReset, userNickCheck, userEmailCheck };
};
