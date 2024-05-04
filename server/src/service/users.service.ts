import userRepository from "@/repository/users.repository";
import { SALT_ROUND } from "@/settings";
import bcrypt from 'bcrypt';

const join = async (email:  string, password: string, nickName: string) => {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

	await userRepository.create(email, hashedPassword, nickName);
};

const usersService = {
	join,
};

export default usersService;
