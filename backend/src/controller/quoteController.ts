import { Request, Response } from "express";
import {
  serviceAcceptQuote,
  serviceAddQuote,
  serviceFetchQuotesByProviderId,
  serviceFetchQuotesByServiceRequestId,
  serviceFetchQuotesForHomeOwner,
} from "../services/Quote.services";

// TODO creating quote
export const createQuote = async (req: Request, res: Response) => {
  try {
    const { u_id, role } = (req as any).user;
    const { price, startDate, endDate, message } = req.body;
    const { serviceRequestId } = req.params;
    // console.log("create quote hit");
    

    if (role !== "provider") {
      return res
        .status(403)
        .json({ success: false, msg: "Access denied: Not a provider" });
    }
    if (!price || !startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
    }
    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      return res.status(400).json({
        success: false,
        msg: "Price and estimatedCompletionDays must be numbers",
      });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Checking the dates validation
    if (start >= end) {
      return res
        .status(400)
        .json({ success: false, msg: "End date must be after start date" });
    }

    if (start <= new Date()) {
      return res
        .status(400)
        .json({ success: false, msg: "Start date must be in the future" });
    }

    // ! it will check the recurrence also
    const newQuote = await serviceAddQuote(
      u_id,
      Number(serviceRequestId),
      priceNum,
      startDate,
      endDate,
      message,
    );
    return res.status(201).json({
      success: true,
      msg: "Quote added successfully",
      data: newQuote,
    });
  } catch (error: any) {
  console.error("Quote error:", error);

  const knownMessages = [
    "Provider profile not found",
    "Service request not found",
    "You have already submitted a quote for this service request.",
    "Start date cannot be after the recurrence end date",
    "End date cannot be after the recurrence end date",
    "Start date cannot be after end date"
  ];

  if (knownMessages.includes(error.message)) {
    return res.status(400).json({ success: false, msg: error.message });
  }

  return res
    .status(500)
    .json({ success: false, msg: "Internal Server Error" });
}

};
// Fetching quotes for specific service request by id
// !very both can be used by homeowner and provider
export const fetchQuotesByServiceReqId = async (
  req: Request,
  res: Response
) => {
  try {
    const { u_id, role } = (req as any).user;
    const { serviceRequestId } = req.params;

    const quotes = await serviceFetchQuotesByServiceRequestId(
      parseInt(serviceRequestId)
    );

    return res.status(201).json({
      success: true,
      msg: "Quote Fetched successfully",
      data: quotes,
    });
  } catch (error) {
    console.error("Quote  fetching error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// NO NEED
// HOMEOWNER SPECIFIC
// TODO ALL Quotes to HomeOwner
// ! not all quotes only for his servicerequests specific quotes only
export const fetchQuotesToHomeOwner = async (req: Request, res: Response) => {
  try {
    const { u_id, role } = (req as any).user;

    if (role !== "homeowner") {
      return res
        .status(403)
        .json({ success: false, msg: "Access denied Not an Home owner" });
    }

    const quotes = await serviceFetchQuotesForHomeOwner(u_id);
    return res.status(200).json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error("Quote error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// PROVIDER SPECIFIC
// TODO Only specific Quotes to Provider
//! provider nnu avante matrham list aya mathi
export const fetchQuotesToProvider = async (req: Request, res: Response) => {
  try {
    const { u_id, role } = (req as any).user;

    if (role !== "provider") {
      return res.status(403).json({ success: false, msg: "Access denied" });
    }

    const quotes = await serviceFetchQuotesByProviderId(u_id);

    return res.status(200).json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error("Fetch provider quotes error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

/// HOMEOWNER ACCEPTING QUOTES
export const acceptQuote = async (req: Request, res: Response) => {
  try {
    const { u_id, role } = (req as any).user;
    // console.log(u_id);
    
    const { quoteId } = req.params;
    // console.log(quoteId);
    

    if (role !== "homeowner") {
      return res
        .status(403)
        .json({ success: false, msg: "Access denied Not an Home owner" });
    }


    const acceptedQuote = await serviceAcceptQuote(parseInt(quoteId), u_id);

    return res.status(200).json({
      success: true,
      msg: "Quote accepted and job created",
      data: acceptedQuote,
    });
  } catch (error:any) {
    console.error("Accepting  quotes error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message|| "Internal Server Error" });
  }
};

// export const rejectQuote=async(req:Request,res:Response)=>{
//     try {
//         const { u_id, role } = (req as any).user;
//     const { quoteId } = req.params;

//     if (role !== "homeowner") {
//       return res
//         .status(403)
//         .json({ success: false, msg: "Access denied Not an Home owner" });
//     }
//     const rejectQuote=

//     } catch (error) {
//     console.error("Rejecting quotes error:", error);
//     return res
//       .status(500)
//       .json({ success: false, msg: "Internal Server Error" });
//   }
// }