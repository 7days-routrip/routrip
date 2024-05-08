import { AppDataSource } from "@/config/ormSetting";
import { Users } from "@/models/users.model";
import usersService from "@/service/users.service";
import { iPatchData, iResetCheckData, iResetPassword, iUserResetPasswordData } from "@/types/users.types";

const create = async (email: string, hashedPassword: string, nickName: string) => {
  const userRepository = AppDataSource.getRepository(Users);

  const user = new Users();
  user.email = email;
  user.nickName = nickName;
  user.password = hashedPassword;

  await userRepository.save(user);
};

const findByEmail = async (email: string) => {
  const userRepository = AppDataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: {
      email,
    },
  });

  return user;
};

const findByNickname = async (nickName: string) => {
  const userRepository = AppDataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: {
      nickName,
    },
  });

  return user;
};

const patchData = async (data: iPatchData, userId: number) => {
  const repo = AppDataSource.getRepository(Users);
  try {
    const result = await repo
      .createQueryBuilder()
      .update({
        nickName: data.nickName,
        profileImg: data.profileImg,
      })
      .where("id = :id", { id: userId })
      .execute();
    console.log(result);
    if (result.affected === 0) throw new Error("user data don't update");
    return { success: true };
  } catch (err) {
    return { success: false, msg: "user data don't update" };
  }
};

const resetCheck = async (data: iResetCheckData) => {
  const repo = AppDataSource.getRepository(Users);
  try {
    const result = await repo
      .createQueryBuilder("us")
      .select(["us.id, us.email"])
      .where("email = :email", { email: data.email })
      .getRawOne();
    console.log(result);
    if (result.length === 0) throw new Error("user does not exist");
    return { success: true };
  } catch (err) {
    return { success: false, msg: "user does not exist" };
  }
};

const resetPassword = async (data: iResetPassword) => {
  const repo = AppDataSource.getRepository(Users);
  try {
    const password = await usersService.hashPassword(data.password);
    const result = await repo
      .createQueryBuilder()
      .update({
        password: password,
      })
      .where("email = :email", { email: data.email })
      .execute();
    if (result.affected === 0) throw new Error("user does not exist");
    return { success: true };
  } catch (err) {
    return { success: false, msg: "user does not exist" };
  }
};
const getUserDataRequest = async (userId: number) => {
  const repo = AppDataSource.getRepository(Users);
  try {
    const result = await repo
      .createQueryBuilder("us")
      .select(["us.id, us.password, us.email, us.createdAt"])
      .where("id = :id", { id: userId })
      .getRawOne();
    if (result) return result;
    throw new Error("user does not exist");
  } catch (err) {
    return false;
  }
};
const userResetPassword = async (data: iUserResetPasswordData, userData: iResetPassword) => {
  const repo = AppDataSource.getRepository(Users);
  try {
    const matchResult = await usersService.comparePassword(data.originPassword, userData.password);
    if (!matchResult) throw new Error("wrong password");
    const password = await usersService.hashPassword(data.newPassword);
    const result = await repo
      .createQueryBuilder()
      .update({
        password: password,
      })
      .where("email = :email", { email: userData.email })
      .execute();
    if (result.affected === 0) throw new Error("user does not exist");
    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, msg: err.message };
    }
  }
};
const userRepository = {
  create,
  findByEmail,
  findByNickname,
  patchData,
  resetCheck,
  resetPassword,
  userResetPassword,
  getUserDataRequest,
};

export default userRepository;
