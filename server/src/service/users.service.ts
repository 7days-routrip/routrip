import userRepository from "@/repository/users.repo";
import { SALT_ROUND } from "@/settings";
import { iUserResetCompareProps } from "@/types/users.types";
import { getNewAccessToken, getNewRefreshToken } from "@/utils/token";
import { StringColorFormat } from "@faker-js/faker";
import bcrypt from "bcrypt";

const login = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = getNewAccessToken(user.id, user.nickName);
    const refreshToken = getNewRefreshToken(user.id, user.nickName);

    return { user, accessToken, refreshToken };
  }

  throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
};

const join = async (email: string, password: string, nickName: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

  await userRepository.create(email, hashedPassword, nickName);
};

const checkEmail = async (email: string) => {
  const user = await userRepository.findByEmail(email);
  if (user) throw new Error("이미 존재하는 이메일입니다.");
};

const checkNickname = async (nickname: string) => {
  const user = await userRepository.findByNickname(nickname);
  if (user) throw new Error("이미 존재하는 닉네임입니다.");
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUND);
};
const comparePassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};
const usersService = {
  join,
  login,
  checkEmail,
  checkNickname,
  hashPassword,
  comparePassword,
};

export default usersService;
