import { getToken, removeNickName, removeToken, setToken } from "@/stores/authStore";
import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const DEFAULT_TIMEOUT = Number(process.env.REACT_APP_DEFAULT_TIMEOUT);

const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
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

        window.alert(err.response.data.message);
        window.location.href = "/login";
        return;
      }
      return Promise.reject(err);
    },
  );
  return axiosInstance;
};

export const httpClient = createClient();
