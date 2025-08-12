import { AppDataSource } from "../db/data-source";
import { HomeOwnerProfile } from "../entity/HomeOwnerProfile";
import { serviceGetUserById } from "./User.services";

const homeownerRepository = AppDataSource.getRepository(HomeOwnerProfile);

export const serviceAddHomeOwner = async (
  contactNumber: string,
  address: string,
  userId: number
) => {
  try {
    const user = await serviceGetUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "homeowner") {
      throw new Error("User is not a homeowner");
    }

    const profile = homeownerRepository.create({
      contactNumber,
      address,
      user,
    });

    await homeownerRepository.save(profile);

    return profile;
  } catch (error) {
    console.error("Error creating homeowner profile:", error);
    throw error;
  }
};
// TODO get by userId

export const serviceGetHomeOwnerByUserId = async (userId: number) => {
  try {
    const profile = await homeownerRepository.findOne({
      where: {
        user: { u_id: userId },
      },
      relations: ["user"],
    });
    return profile;
  } catch (error) {
    console.error("Error finding HomeOwnerProfile by userId:", error);
    throw error;
  }
};

// TODO get by  homeownerid
export const serviceGetHomeOwnerById = async (h_id: any) => {
  try {
    const exists = await homeownerRepository.findOne({
      where: { h_id },
      relations: ["user", "servicerequests", "reviews"],
    });
    if (exists) {
      return exists;
    }
    return null;
  } catch (error) {
    console.error("Error Finding  homeowner profile:", error);
    throw error;
  }
};
