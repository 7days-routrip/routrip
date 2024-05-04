import { authJoin, authLogin } from "@/apis/auth.api";
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
      storeLogin(loginRes.Authorization, loginRes.nickname);
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

  return { userLogin, userJoin };
};
