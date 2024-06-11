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
import { JoinProps, LoginProps } from "@/models/user.model";
import { useAuthStore } from "@/stores/authStore";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// 공통 에러 핸들러
export const fetchErrorStatusHandler = (error: any, statusList: number[]) => {
  if (statusList.includes(error.response.status)) {
    return error.response;
  } else {
    showAlert(error.data.message, "error");
  }
};

// 공통 체크 핸들러
const handleUserCheck = async <T>(
  checkFunction: (data: T) => Promise<any>,
  data: T,
  field: string,
  setUniqueCheck: React.Dispatch<React.SetStateAction<boolean>>,
  clearErrors: UseFormClearErrors<any>,
  setError: UseFormSetError<any>,
) => {
  try {
    const res = await checkFunction(data);
    if (res.status === 200) {
      setUniqueCheck((prev) => !prev);
      clearErrors(field);
    }
    return res;
  } catch (error: any) {
    if (error.status === 409) {
      setError(field, { message: error.data.message }, { shouldFocus: true });
      return;
    } else if (error.status === 400) {
      showAlert(error.data.message, "error");
      return;
    }
    return fetchErrorStatusHandler(error, []);
  }
};

// 공통 인터페이스 정의
interface UserCheckProps {
  clearErrors: UseFormClearErrors<any>;
  setError: UseFormSetError<any>;
}

// 닉네임 체크 인터페이스 정의
interface UserNicknameCheckProps extends UserCheckProps {
  nickname: string;
  setNicknameUniqueCheck: React.Dispatch<React.SetStateAction<boolean>>;
}

// 이메일 체크 인터페이스 정의
interface UserEmailCheckProps extends UserCheckProps {
  email: string;
  setEmailUniqueCheck: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAuth = () => {
  const navigate = useNavigate();
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
      return fetchErrorStatusHandler(error, []);
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
      return res;
    } catch (error: any) {
      return fetchErrorStatusHandler(error, [400]);
    }
  };

  const userNicknameCheck = async ({
    nickname,
    setNicknameUniqueCheck,
    clearErrors,
    setError,
  }: UserNicknameCheckProps) => {
    return handleUserCheck(isNicknameUnique, { nickname }, "nickname", setNicknameUniqueCheck, clearErrors, setError);
  };

  const userEmailCheck = async ({ email, setEmailUniqueCheck, clearErrors, setError }: UserEmailCheckProps) => {
    return handleUserCheck(isEmailUnique, { email }, "email", setEmailUniqueCheck, clearErrors, setError);
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
      return fetchErrorStatusHandler(error, []);
    }
  };

  const userNewPasswordReset = async (originPassword: string, newPassword: string) => {
    try {
      await fetchProfileRestPassword({ originPassword, newPassword });
      navigate("/me");
    } catch (error) {
      return fetchErrorStatusHandler(error, [400]);
    }
  };

  const userResign = async () => {
    try {
      const res = await fetchUserResign();
      if (res?.status === 200) {
        showAlert("탈퇴되었습니다.", "logo");
      }
      return res;
    } catch (error) {
      return fetchErrorStatusHandler(error, []);
    }
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
