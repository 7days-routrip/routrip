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

const userRepository = {
  create,
};

export default userRepository;
