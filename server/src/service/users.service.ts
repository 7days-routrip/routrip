import userRepository from "@/repository/users.repository";
import { SALT_ROUND } from "@/settings";
import bcrypt from "bcrypt";

const join = async (email: string, password: string, nickName: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

  await userRepository.create(email, hashedPassword, nickName);
};

const login = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    // 토큰 발행 로직 추가
    return { user /* token */ };
  }

  throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
};

const usersService = {
  join,
  login,
};

export default usersService;
