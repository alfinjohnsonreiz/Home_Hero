import { AppDataSource } from "../db/data-source";
import { ServiceRequest } from "../entity/ServiceRequest";
import {
  serviceGetHomeOwnerById,
  serviceGetHomeOwnerByUserId,
} from "./homeOwner.service";

export const serviceRequestRepository =
  AppDataSource.getRepository(ServiceRequest);

export const serviceAddServiceReq = async (
  title: string,
  description: string,
  category: any,
  urgent: any,
  location: string,
  photos: any,
  h_id: any,
  isRecurring?: boolean,
  recurrenceFrequency?: "weekly" | "monthly",
  recurrenceInterval?: number,
  recurrenceEndDate?: Date
) => {
  try {
    const homeOwner = await serviceGetHomeOwnerById(h_id);
    if (!homeOwner) {
      throw new Error("Homeowner not found");
    }
    const newRequest = serviceRequestRepository.create({
      title,
      description,
      category,
      urgent,
      location,
      photos,
      homeownerprofile: homeOwner,
      isRecurring: isRecurring ?true: false,
      recurrenceFrequency,
      recurrenceInterval: recurrenceInterval ?? 1,
      recurrenceEndDate,
    });

    await serviceRequestRepository.save(newRequest);
    return newRequest;
  } catch (error) {
    console.error("Error creating ServiceRequest:", error);
    throw error;
  }
};

export const serviceFetchServiceReqByHomeOwnerId = async (h_id: any) => {
  try {
    const serviceRequests = await serviceRequestRepository.find({
      where: {
        homeownerprofile: {
          h_id: h_id,
        },
      },
      relations: ["homeownerprofile", "quotes", "quotes.providerprofile"],
    });
    return serviceRequests;
  } catch (error) {
    console.error("Error fetching ServiceRequests by homeowner ID:", error);
    throw error;
  }
};
export const serviceFetchALLServiceReq = async () => {
  try {
  } catch (error) {}
};
export const serviceFetchServiceReqAll = async () => {
  try {
    const serviceRequests = await serviceRequestRepository.find({
      relations: [
        "quotes", // Include all quotes for each service request
        "quotes.providerprofile", // Include provider details for each quote
        "quotes.providerprofile.user", // Include provider details for each quote
      ],
    });
    return serviceRequests;
  } catch (error) {
    console.error("Error fetching All ServiceRequests:", error);
    throw error;
  }
};
// TODO Fetching
export const serviceFetchServiceReqAllWithProviderQuotes = async (
  u_id: any
) => {
  try {
    const serviceRequests = await serviceRequestRepository.find({
      relations: [
        "quotes", // Include all quotes for each service request
        "quotes.providerprofile", // Include provider details for each quote
        "quotes.providerprofile.user",
      ],
      where: {
        quotes: {
          providerprofile: {
            user: { u_id: u_id },
          },
        },
      },
    });
    return serviceRequests;
  } catch (error) {
    console.error("Error fetching All ServiceRequests:", error);
    throw error;
  }
};

//Todo get by id
export const serviceFetchServiceReqById = async (s_id: number) => {
  try {
    const serviceRequest = await serviceRequestRepository.findOne({
      where: { s_id },
      relations: ["homeownerprofile", "quotes"],
    });

    return serviceRequest;
  } catch (error) {
    console.error("Error fetching service request by ID:", error);
    throw error;
  }
};
