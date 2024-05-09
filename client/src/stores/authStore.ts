import { create } from "zustand";

interface StoreState {
  nickName: string | null;
  isLoggedIn: boolean; // 상태 변수(state)
  storeLogin: (token: string, name: string, userId: number) => void; // 상태 변경 함수(action)
  storeLogout: () => void;
}

export const getNickName = () => {
  const userName = localStorage.getItem("nickName");
  return userName;
};

export const setNickName = (name: string) => {
  localStorage.setItem("nickName", name);
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("야 로그인했어!");
  return token; // 로컬 스토리지에 "token"필드가 없는 경우엔 null을 반환
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const setUserId = (userId: string) => {
  localStorage.setItem("userId", userId);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const removeNickName = () => {
  localStorage.removeItem("nickName");
};

export const removeUserId = () => {
  localStorage.removeItem("userId");
};

//  빠짐  //
export const useAuthStore = create<StoreState>((set) => ({
  nickName: getToken() ? getNickName() : null,
  isLoggedIn: getToken() ? true : false, // 초기값 설정
  storeLogin: (token: string, name: string, userId: number) => {
    set({ isLoggedIn: true });
    setNickName(name);
    setUserId(`${userId}`);
    setToken(token);
  },
  storeLogout: () => {
    set({ isLoggedIn: false });
    removeToken();
    removeNickName();
    removeUserId();
  },
}));
