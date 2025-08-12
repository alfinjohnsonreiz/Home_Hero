import { Request, Response } from "express";
import {
  serviceAddServiceReq,
  serviceFetchServiceReqAll,
  serviceFetchServiceReqAllWithProviderQuotes,
  serviceFetchServiceReqByHomeOwnerId,
  serviceFetchServiceReqById,
  serviceRequestRepository,
} from "../services/serviceReq.service";
import { serviceGetHomeOwnerByUserId } from "../services/homeOwner.service";
import { serviceGetProviderByUserId } from "../services/Provider.service";
import { ServiceCategory } from "../types/types";

// Creating the service request
// !Only for home owner
export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { u_id, role } = user;
    const { title, description, category, urgent, location } = req.body;

    if (role !== "homeowner") {
      return res
        .status(404)
        .json({ success: false, msg: "UnAuthorized Access" });
    }

    // Fetch homeowner profile by user ID
    const homeOwner = await serviceGetHomeOwnerByUserId(u_id);
    if (!homeOwner) {
      return res
        .status(404)
        .json({ success: false, msg: "Homeowner profile not found" });
    }
    const normalizedCategory = String(category).trim().toLowerCase();

    if (!Object.values(ServiceCategory).includes(normalizedCategory)) {
      throw new Error("Invalid category");
    }

    // Get uploaded photo filenames
    const uploadedFiles = req.files as Express.Multer.File[];
    const photoFilenames = uploadedFiles?.map((file) => file.filename) || [];

    console.log("Type of isRecurring", typeof req.body.isRecurring);
    // TODO CHECKBOX
    // ! important true or false is comes as string
    // ! STRING 
    const isRecurring = req.body.isRecurring == "true" ? true : false;
    const isUrgent = urgent== "true" ? true :false

    const recurrenceFrequency = req.body.recurrenceFrequency ?? null;
    const recurrenceInterval = req.body.recurrenceInterval ?? 1;
    const recurrenceEndDate = req.body.recurrenceEndDate
      ? new Date(req.body.recurrenceEndDate)
      : null;

    //! setting today date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // no time needed

    if (isRecurring) {
      if (
        !recurrenceFrequency ||
        !["weekly", "monthly"].includes(recurrenceFrequency)
      ) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Recurrence Interval" });
      }
      if (recurrenceEndDate) {
        //! setting recurrence End Date
        const endDate = new Date(recurrenceEndDate);
        endDate.setHours(0, 0, 0, 0); // no time needed

        if (recurrenceFrequency === "weekly") {
          const minEndDate = new Date(today);
          minEndDate.setDate(
            minEndDate.getDate() + 7 * (recurrenceInterval ?? 1)
          );
          if (endDate < minEndDate) {
            return res.status(400).json({
              success: false,
              msg: `For weekly recurrence, end date should be at least ${
                7 * (recurrenceInterval ?? 1)
              } days after today`,
            });
          }
        }
        if (recurrenceFrequency == "monthly") {
          const minEndDate = new Date(today);
          minEndDate.setMonth(
            minEndDate.getMonth() + (recurrenceInterval ?? 1)
          );
          if (endDate < minEndDate) {
            return res.status(400).json({
              success: false,
              msg: `For monthly recurrence, end date should be at least ${
                recurrenceInterval ?? 1
              } month(s) after today`,
            });
          }
        }
      }
    }

    const newServiceRequest = await serviceAddServiceReq(
      title,
      description,
      normalizedCategory as ServiceCategory,
      isUrgent,
      location,
      photoFilenames,
      homeOwner.h_id,
      isRecurring,
      recurrenceFrequency,
      recurrenceInterval,
      recurrenceEndDate ? new Date(recurrenceEndDate) : undefined
    );
    return res.status(201).json({
      success: true,
      msg: "Service Request Added ",
      data: newServiceRequest,
    });
  } catch (error: any) {
    console.error("Service Request error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal Server Error" });
  }
};

//TODO get specific service request of logged user role homwowner
// >>>>>HOMEOWNER>>>>>>
export const fetchServiceReqOfLogOwner = async (
  req: Request,
  res: Response
) => {
  try {
    const { u_id, role } = (req as any).user;

    if (role !== "homeowner") {
      return res
        .status(403)
        .json({ success: false, msg: "Access denied: Not a homeowner" });
    }
    //  to get homeowner_id from u_id
    const homeowner = await serviceGetHomeOwnerByUserId(u_id);
    if (!homeowner) {
      return res
        .status(404)
        .json({ success: false, msg: "Homeowner profile not found" });
    }

    const serviceRequests = await serviceFetchServiceReqByHomeOwnerId(
      homeowner.h_id
    );
    return res.status(200).json({
      success: true,
      data: serviceRequests,
    });
  } catch (error: any) {
    console.error("Service Request error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal Server Error" });
  }
};

// TODO fetch all for showing to provider but not all quotes
// ! ONLY TO PROVIDER NOT TO HOMEOWNER
// >>>>>PROVIDER>>>>>
export const fetchServiceReqAllWithProviderQuotes = async (
  req: Request,
  res: Response
) => {
  try {
    const { u_id, role } = (req as any).user;

    if (role !== "provider") {
      return res
        .status(403)
        .json({ success: false, msg: "Access denied: Not a Provider" });
    }
    //  to get homeowner_id from u_id
    const provider = await serviceGetProviderByUserId(u_id);
    if (!provider) {
      return res
        .status(404)
        .json({ success: false, msg: "Provider profile not found" });
    }
    // const serviceRequests = await serviceFetchServiceReqAllWithProviderQuotes(u_id);
    const serviceRequests = await serviceFetchServiceReqAll();
    // TODO Showing only provider profile
    // ! provider quotes but all services
    const fileteredServiceRequests = serviceRequests.map((service) => {
      return {
        ...service,
        quotes: service.quotes.filter(
          (quote) => quote.providerprofile.user.u_id === parseInt(u_id)
        ),
      };
    });
    return res.status(200).json({
      success: true,
      data: fileteredServiceRequests,
    });
  } catch (error: any) {
    console.error("Service Request error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal Server Error" });
  }
};

export const deleteServiceReq=async(req:Request,res:Response)=>{
  try {
    const serviceReqId=parseInt(req.params.serviceReqId)
    console.log("Id is ",serviceReqId);
    
    const serviceReq=await serviceFetchServiceReqById(serviceReqId)
    if(!serviceReq){
      return res.status(404).json({success:false,msg:"Request not found"})
    }
    await serviceRequestRepository.delete({s_id:Number(serviceReqId)})
    return res.json({success:true,msg:"Item Deletd Successfully"})
    
  } catch (error: any) {
    console.error("Service Request error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal Server Error" });
  }
};
