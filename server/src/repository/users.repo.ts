import { AppDataSource } from "@/config/ormSetting";
import { Users } from "@/models/users.model";

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
const UserRepository = {
  create,
  findByEmail,
  findByNickname,
};

export default UserRepository;
