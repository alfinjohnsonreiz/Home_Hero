import { AppDataSource } from "../db/data-source";
import { Role, User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User);

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}
export const serviceCreateUser = async ({
  name,
  email,
  password,
  role,
}: CreateUserInput): Promise<User> => {
  try {
    const user = userRepository.create({ name, email, password, role }); // 👈 must be object, not array
    const savedUser = await userRepository.save(user); // 👈 must be object, not array
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
export const serviceGetUserByEmail = async (email: any) => {
  try {
    const user = await userRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};
export const serviceGetUserById = async (id: number) => {
  try {
    const user = await userRepository.findOne({ where: { u_id: id },relations:['homeownerprofile','providerprofile'] });
    return user ?? null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
