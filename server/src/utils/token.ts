import { JWT_EXPIRED_IN, JWT_SECRET } from "@/settings";
import jwt, { JwtPayload } from "jsonwebtoken";

const getCurrentDate = () => {
  return (new Date().getTime() + 1) / 1000;
};
const getDecodedData = (token: string): JwtPayload => {
  const data = jwt.decode(token) as JwtPayload;
  return data;
};
const refreshExpiredCheck = (refreshToken: string, currentDate: number): boolean => {
  let result: boolean;
  const { exp } = getDecodedData(refreshToken);
  if (exp && exp < currentDate) {
    result = true;
  } else {
    result = false;
  }

  return result;
};
const validTokenCheck = async (accessToken: string, refreshToken: string) => {
  const accessDecoded = getDecodedData(accessToken);
  const currentDate = getCurrentDate(); // 요쳥날린 시간의 currentDate 반환 함수
  if (accessDecoded.exp && accessDecoded.exp < currentDate) {
    if (refreshExpiredCheck(refreshToken, currentDate)) {
      // refreshToken 만료일을 비교하여 true/false 반환
      return { msg: "refreshToken 무효" };
    } else {
      return { msg: "accessToken 유효하지 않음" };
    }
  } else {
    return { msg: "accessToken 유효" };
  }
};
const getNewAccessToken = (userId: number, nickName: string): string => {
  const accessToken = jwt.sign(
    {
      userId: userId,
      nickName: nickName,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRED_IN,
    },
  );
  return accessToken;
};
export { getNewAccessToken, validTokenCheck };
