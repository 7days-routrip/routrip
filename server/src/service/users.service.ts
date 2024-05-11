import { AppDataSource } from "@/config/ormSetting";
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

  throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
};

const join = async (email: string, password: string, nickName: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

  await UserRepository.create(email, hashedPassword, nickName);
};

const reqUserWithdraw = async (userId: number) => {
  const userDropResult = await userRepo.delete(userId);
  console.log(userDropResult);
  if (!userDropResult.affected || userDropResult.affected < 1) return { success: false, msg: "failed to withdraw" };
  return { success: true };
};

const reqUsersUpdate = async (data: iPatchData, userId: number) => {
  const patch = {
    nickName: data.nickName,
    profileImg: data.profileImg,
  };
  const userUpdateResult = await userRepo.update(userId, patch);
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

const checkEmail = async (email: string) => {
  const user = await UserRepository.findByEmail(email);

  if (user) return { success: true, msg: "사용자가 존재합니다." };
  return { success: false, msg: "존재하지 않는 사용자 입니다." };
};

const checkNickname = async (nickname: string) => {
  const user = await UserRepository.findByNickname(nickname);
  if (user) throw new Error("이미 존재하는 닉네임입니다.");
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
};

export default UsersService;
