import { AppDataSource } from "../db/data-source";
import { Job } from "../entity/Job";
import { Quote, QuoteStatus } from "../entity/Quote";
import { serviceGetHomeOwnerByUserId } from "./homeOwner.service";
import { serviceCreateJob } from "./job.service";
import { serviceGetProviderByUserId } from "./Provider.service";
import { serviceFetchServiceReqById } from "./serviceReq.service";
import { Not } from "typeorm";

const quoteRepository = AppDataSource.getRepository(Quote);
const jobRepo = AppDataSource.getRepository(Job);

// ADDING by provider
export const serviceAddQuote = async (
  u_id: number,
  serviceRequestId: number,
  price: number,
  startDate?: any,
  endDate?: any,
  message?: string
) => {
  try {
    const provider = await serviceGetProviderByUserId(u_id);
    if (!provider) throw new Error("Provider profile not found");

    const serviceRequest = await serviceFetchServiceReqById(serviceRequestId);
    if (!serviceRequest) throw new Error("Service request not found");

    // TODO Important
    //! prevent duplicate quotes
    //! REASON
    // A service request can receive multiple quotes, but:
    // Each provider should ideally send only one quote per request (like one job proposal per gig).
    const existingQuote = await quoteRepository.findOne({
      where: {
        providerprofile: { p_id: provider.p_id },
        servicerequest: { s_id: serviceRequestId },
      },
    });

    if (existingQuote) {
      throw new Error(
        "You have already submitted a quote for this service request."
      );
    }

    // !Checking recurring is enabled or not
    if (serviceRequest.isRecurring) {
      const recurrenceEndDate = new Date(serviceRequest?.recurrenceEndDate)
      const quoteStartDate = new Date(startDate);
      const quoteEndDate = endDate ? new Date(endDate) : null;

      if (quoteStartDate > recurrenceEndDate) {
        throw new Error(
          `Start date cannot be after the recurrence end date`
        );
      }
      if (quoteEndDate && quoteEndDate > recurrenceEndDate) {
        throw new Error(
          `End date cannot be after the recurrence end date`
        );
      }
      if (quoteEndDate && quoteStartDate > quoteEndDate) {
        throw new Error(
          `Start date cannot be after end date`
        );
      }
    }
    //! Create a new quote
    const newQuote = quoteRepository.create({
      price,
      message,
      startDate,
      endDate,
      status: QuoteStatus.PENDING,
      providerprofile: provider,
      servicerequest: serviceRequest,
    });

    await quoteRepository.save(newQuote);
    return newQuote;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error;
  }
};

// NO NEED
// ! Fetch Quotes for a Specific serviceRequestId
export const serviceFetchQuotesByServiceRequestId = async (
  serviceRequestId: number
) => {
  const quotes = await quoteRepository.find({
    where: {
      servicerequest: { s_id: serviceRequestId },
    },
    relations: [
      "providerprofile",
      "servicerequest",
      "servicerequest.homeownerprofile",
    ],
    order: { q_id: "DESC" },
  });

  return quotes;
};

//!  Fetch only Quotes  by logged in homeowner
//TODO only for homeowner
// ! very very important only fetch his homeowner not other homeowners
export const serviceFetchQuotesForHomeOwner = async (u_id: number) => {
  try {
    const homeowner = await serviceGetHomeOwnerByUserId(u_id);
    if (!homeowner) throw Error("You are not home owner");

    // fetching only his servicerequests quotes not others
    const quotes = await quoteRepository.find({
      relations: [
        "servicerequest",
        "providerprofile",
        "servicerequest.homeownerprofile",
      ],
      where: {
        servicerequest: {
          homeownerprofile: {
            h_id: homeowner.h_id,
          },
        },
      },
    });
    return quotes;
  } catch (error) {
    console.error("Error Fetching quote:", error);
    throw error;
  }
};

//! Fetch only Quotes by logged in provider
//TODO Specific Provider nte matram quotes
// ! very very important only his quotes only
export const serviceFetchQuotesByProviderId = async (u_id: number) => {
  try {
    const provider = await serviceGetProviderByUserId(u_id);
    if (!provider) throw new Error("Provider profile not found");

    const quotes = await quoteRepository.find({
      where: {
        providerprofile: { p_id: provider.p_id },
      },
      relations: ["servicerequest"],
      order: { q_id: "DESC" },
    });

    return quotes;
  } catch (error) {
    console.error("Error Fetching quote:", error);
    throw error;
  }
};

// ! Accepting quotes
export const serviceAcceptQuote = async (quoteId: any, u_id: any) => {
  try {
    const quote = await quoteRepository.findOne({
      where: { q_id: quoteId },
      relations: [
        "servicerequest",
        "providerprofile",
        "servicerequest.homeownerprofile",
        "servicerequest.homeownerprofile.user",
      ],
    });
    if (!quote) throw new Error("Quote not found");

    // console.log("The quote is", quote);

    // console.log(u_id)
    //! ONLY author can Accept the quote
    // Quote has serviceReq and inside we have the homeowner who created
    // check with that homeowner.
    const homeowner = quote.servicerequest.homeownerprofile;
    if (!homeowner || homeowner.user.u_id !== u_id) {
      throw new Error("You are not authorized to accept this quote");
    }
    // console.log("the home owner is:", homeowner);

    // //! Check if a job already exists for this service request
    const existingJob = await jobRepo.findOne({
      where: { servicerequest: { s_id: quote.servicerequest.s_id } },
    });
    // console.log("Is thers any ", existingJob);

    if (existingJob) {
      throw new Error(
        "A job has already been created for this service request"
      );
    }

    // ! checking if the 
    
    //! After that
    // Update the accepted quote
    quote.status = QuoteStatus.ACCEPTED;
    await quoteRepository.save(quote);


    // //! (1) reject all other quotes inside the same serviceRequest
    // await quoteRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({ status: QuoteStatus.REJECTED })
    //   .where("servicerequestId = :srid", { srid: quote.servicerequest.s_id }) // no alias 'quote.'
    //   .andWhere("q_id != :qid", { qid: quote.q_id })
    //   .execute();

    //! (2) Reject all other quotes for the same service request (except the accepted one)
    await quoteRepository.update(
      { servicerequestId: quote.servicerequest.s_id, q_id: Not(quote.q_id) },
      { status: QuoteStatus.REJECTED }
    );
    //! Create the job when quote is accepted
    // ! check the service having an recurring
    const newJob = await serviceCreateJob(quote.q_id);
    console.log("the new job", newJob);

    return quote;
  } catch (error: any) {
    console.error("Error Accepting quote:", error);
    throw error;
  }
};

export const serviceGetQuoteById = async (quoteId: number) => {
  const quote = await quoteRepository.findOne({
    where: { q_id: quoteId },
    relations: [
      "providerprofile",
      "servicerequest",
      "servicerequest.homeownerprofile",
      "servicerequest.homeownerprofile.user",
    ],
  });

  if (!quote) throw new Error("Quote not found");
  return quote;
};

// //! Rejecting Quotes
// export const serviceRejectQuote = async (quoteId: number, u_id: number) => {
//   const quote = await quoteRepository.findOne({
//     where: { q_id: quoteId },
//     relations: ["servicerequest", "servicerequest.homeownerprofile"],
//   });

//   if (!quote) throw new Error("Quote not found");

//   const homeowner = quote.servicerequest.homeownerprofile;
//   if (homeowner.user.u_id !== u_id) {
//     throw new Error("Unauthorized to reject this quote");
//   }

//   if (quote.status !== QuoteStatus.PENDING) {
//     throw new Error("Only pending quotes can be rejected");
//   }

//   quote.status = QuoteStatus.REJECTED;
//   return await quoteRepository.save(quote);
// };
