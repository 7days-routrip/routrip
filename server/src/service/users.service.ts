import { AppDataSource } from "@/config/ormSetting";
import {
  ALREADY_NICKNAME,
  BAD_REQUEST_LOGIN,
  EXIST_USER,
  FAILED_HASH_PASSWORD,
  NOT_EXIST_USER,
} from "@/constants/message";
import { Users } from "@/models/users.model";
import UserRepository from "@/repository/users.repo";
import { SALT_ROUND } from "@/settings";
import { iPatchData, iResetPassword, iUserResetPasswordData } from "@/types/users.types";
import { getNewAccessToken, getNewRefreshToken } from "@/utils/token";
// import { StringColorFormat } from "@faker-js/faker";
import bcrypt from "bcrypt";

const userRepo = AppDataSource.getRepository(Users);

const login = async (email: string, password: string) => {
  const user = await UserRepository.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = getNewAccessToken(user.id, user.nickName);
    const refreshToken = getNewRefreshToken(user.id, user.nickName);

    return { user, accessToken, refreshToken };
  }

  throw new Error(BAD_REQUEST_LOGIN);
};

const join = async (email: string, password: string, nickName: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

  if (!hashedPassword) throw new Error(FAILED_HASH_PASSWORD);

  return await UserRepository.create(email, hashedPassword, nickName);
};

const reqUserWithdraw = async (userId: number) => {
  const userDropResult = await userRepo.delete(userId);
  if (!userDropResult.affected || userDropResult.affected < 1) return { success: false, msg: "failed to withdraw" };
  return { success: true };
};

const reqUsersUpdate = async (data: iPatchData, userId: number) => {
  const userUpdateResult = await userRepo.update(userId, data);
  if (!userUpdateResult.affected || userUpdateResult.affected < 1) return { success: false, msg: "failed to update" };
  return { success: true };
};
const reqPasswordUpate = async (data: iResetPassword) => {
  const hashedPassword = await hashPassword(data.password);
  const passwordUpdateResult = await userRepo.update({ email: data.email }, { password: hashedPassword });
  if (!passwordUpdateResult.affected || passwordUpdateResult.affected < 1)
    return { success: false, msg: "failed to update" };
  return { success: true };
};

const reqUserPasswordUpdate = async (data: iUserResetPasswordData, userId: number) => {
  const hashedPassword = await hashPassword(data.newPassword);
  const passwordUpdateResult = await userRepo.update(userId, { password: hashedPassword });
  if (!passwordUpdateResult.affected || passwordUpdateResult.affected < 1)
    return { success: false, msg: "failed to update" };
  return { success: true };
};

const reqImageUpload = async (path: string, userId: number) => {
  return await userRepo.update(userId, { profileImg: path });
};
const checkEmail = async (email: string) => {
  const user = await UserRepository.findByEmail(email);

  if (user) return { success: true, msg: EXIST_USER };
  return { success: false, msg: NOT_EXIST_USER };
};

const checkNickname = async (nickname: string) => {
  const user = await UserRepository.findByNickname(nickname);
  if (user) throw new Error(ALREADY_NICKNAME);
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUND);
};

const comparePassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};
const findUser = async (userId: number) => {
  return await userRepo.findOne({ where: { id: userId } });
};

const UsersService = {
  join,
  login,
  checkEmail,
  checkNickname,
  findUser,
  hashPassword,
  comparePassword,
  reqUsersUpdate,
  reqPasswordUpate,
  reqUserPasswordUpdate,
  reqUserWithdraw,
  reqImageUpload,
};

export default UsersService;
