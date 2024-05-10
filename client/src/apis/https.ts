import { getToken, removeNickName, removeToken, setToken } from "@/stores/authStore";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
    ...config,
  });

  // 요청 인터셉터
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = getToken();
      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
      } else {
        delete config.headers.authorization;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (res) => {
      const newAccessToken = res.headers.authorization;
      if (newAccessToken) {
        const token = newAccessToken.split(" ")[1];
        setToken(token);
      }
      return res;
    },
    (err) => {
      if (err.response.status === 401) {
        removeToken();
        removeNickName();

        showConfirm(err.response.data.message, () => {
          window.location.href = "/login";
        });
        return;
      } else if (err.response.status >= 500) {
        showAlert("서버에 문제가 발생했습니다. 잠시 후에 다시 시도해주세요.", "error");
        return;
      }

      return Promise.reject(err);
    },
  );
  return axiosInstance;
};

export const httpClient = createClient();
