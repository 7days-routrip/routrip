import { Users } from "@/models/users.model";
import userRepository from "@/repository/users.repo";
import {
  JWT_ACCESS_EXPIRED_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRED_IN,
  JWT_REFRESH_SECRET,
  SALT_ROUND,
} from "@/settings";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (user: any) => {
  return jwt.sign({ userId: user.id, nickName: user.nickName }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRED_IN });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ userId: user.id, nickName: user.nickName }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRED_IN });
};

const login = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    // 토큰 발행 로직
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
}

const checkNickname = async (nickname: string) => {
  const user = await userRepository.findByNickname(nickname);
  if (user) throw new Error("이미 존재하는 닉네임입니다.");
}

const usersService = {
  join,
  login,
  checkEmail,
  checkNickname,
};

export default usersService;
