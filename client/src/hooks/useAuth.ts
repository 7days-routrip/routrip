import {
  authJoin,
  authLogin,
  authLogout,
  authReset,
  fetchProfileRestPassword,
  isEmailUnique,
  isNicknameUnique,
  fetchUserResign,
  fetchProfileImage,
  profileUpdate,
} from "@/apis/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";

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
      const token = newAccessToken.split(" ")[1];
      const userName = loginRes.data.nickName;
      const userId = loginRes.data.userId;
      storeLogin(token, userName, userId);
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

  const userPasswordReset = async (data: LoginProps) => {
    try {
      const res = await authReset(data);
      showAlert(`${res.data.message}`, "logo");
      navigate("/login");
      return;
    } catch (error: any) {
      return fetchErrorStatusHandler(error, [400]);
    }
  };

  interface userNicknameCheckProps {
    nickname: string;
    setNicknameUniqueCheck: React.Dispatch<React.SetStateAction<boolean>>;
    clearErrors: UseFormClearErrors<any>;
    setError: UseFormSetError<any>;
  }

  const userNicknameCheck = async ({
    nickname,
    setNicknameUniqueCheck,
    clearErrors,
    setError,
  }: userNicknameCheckProps) => {
    try {
      const res = await isNicknameUnique({ nickname });
      if (res.status === 200) {
        setNicknameUniqueCheck((prev) => !prev);
        clearErrors("nickname");
      }
      return;
    } catch (error: any) {
      if (error.status === 409) {
        setError("nickname", { message: `${error.data.message}` }, { shouldFocus: true });
        return;
      } else if (error.status === 400) {
        showAlert(error.data.message, "error");
        return;
      }
      return fetchErrorStatusHandler(error, [400, 409]);
    }
  };

  interface userEmailCheckProps {
    email: string;
    setEmailUniqueCheck: React.Dispatch<React.SetStateAction<boolean>>;
    clearErrors: UseFormClearErrors<any>;
    setError: UseFormSetError<any>;
  }

  const userEmailCheck = async ({ email, setEmailUniqueCheck, clearErrors, setError }: userEmailCheckProps) => {
    try {
      const res = await isEmailUnique({ email });
      if (res.status === 200) {
        setEmailUniqueCheck((prev) => !prev);
        clearErrors("email");
      }
      return;
    } catch (error: any) {
      if (error.status === 409) {
        setError("email", { message: error.data.message }, { shouldFocus: true });
        return;
      } else if (error.status === 400) {
        showAlert(error.data.message, "error");
        return;
      }
      return fetchErrorStatusHandler(error, [400, 409]);
    }
  };

  const userLogout = async () => {
    try {
      const res = await authLogout();
      return res;
    } catch (error) {
      return fetchErrorStatusHandler(error, []);
    }
  };

  const userProfileImage = async (file: File) => {
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("profile", file);
      const res = await fetchProfileImage(formData);
      if (res === undefined) {
        throw new Error("Failed to upload image to S3.");
      }
      return res;
    } catch (error) {
      return fetchErrorStatusHandler(error, []);
    }
  };

  const userUpdate = async (nickname: string | undefined, profileImg: string | undefined) => {
    try {
      const res = await profileUpdate({ nickname, profileImg });
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

  const userResign = () => {
    try {
      const res = fetchUserResign().then((res) => {
        if (res?.status === 200) {
          showAlert("탈퇴되었습니다.", "logo");
        }
      });
      return res;
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
    userResign,
  };
};
