import { AppDataSource } from "../db/data-source";
import { ProviderProfile } from "../entity/ProviderProfile";
import { serviceGetUserById } from "./User.services";
import { ApiError } from "../utils/ApiError";
export const providerProfileRepository = AppDataSource.getRepository(ProviderProfile);

export const serviceAddProvider = async (
  serviceCategory: string,
  skills: string,
  certification: string,
  userId: any
) => {
  try {
    const user = await serviceGetUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "provider") {
      throw new Error("User is not a Provider");
    }
    const profile = providerProfileRepository.create({
      serviceCategory,
      skills,
      certification,
      user,
    });

    await providerProfileRepository.save(profile);

    return profile;
  } catch (error) {
    console.error("Error creating homeowner profile:", error);
    throw error;
  }
};

//TODO by userid
export const serviceGetProviderByUserId = async (userId: number) => {
  try {
    const provider = await providerProfileRepository.findOne({
      where: {
        user: {
          u_id: userId,
        },
      },
      relations: ["user"],
    });

    return provider;
  } catch (error) {
    console.error("Error fetching provider profile by user ID:", error);
    throw error;
  }
};
// TODO by provider id
export const serviceGetProviderById = async (p_id: number) => {
  try {
    const provider = await providerProfileRepository.findOne({
      where: { p_id },
      relations: ["user", "quotes", "reviews"],
    });

    return provider;
  } catch (error) {
    console.error("Error fetching provider profile by provider ID:", error);
    throw error;
  }
};
