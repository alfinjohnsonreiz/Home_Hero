import { error } from "console";
import { AppDataSource } from "../db/data-source";
import { Job, JobStatus, PaymentStatus } from "../entity/Job";
import { serviceGetQuoteById } from "./Quote.services";
import {
  serviceFetchServiceReqById,
  serviceRequestRepository,
} from "./serviceReq.service";
import { generateRecurrenceDates } from "../recurrence/generateRecurrence";

const jobRepo = AppDataSource.getRepository(Job);

export const serviceCreateJob = async (quoteId: number) => {
  try {
    const quote = await serviceGetQuoteById(quoteId);
    if (!quote) throw new Error("Quote not found");

    //! Check if job already exists for this service request
    const existingJob = await jobRepo.findOne({
      where: { servicerequest: { s_id: quote.servicerequest.s_id } },
    });
    if (existingJob) {
      throw new Error(
        "A job already exists for this service request. cannot accept"
      );
    }

    const newJob = jobRepo.create({
      quote,
      servicerequest: quote.servicerequest,
      providerprofile: quote.providerprofile,
      homeownerprofile: quote.servicerequest.homeownerprofile,
      startDate: quote.startDate,
      endDate: quote.endDate,
      price: quote.price,
      isRecurring: quote.servicerequest.isRecurring,
      recurrenceFrequency: quote.servicerequest.recurrenceFrequency,
      recurrenceInterval: quote.servicerequest.recurrenceInterval,
      recurrenceEndDate: quote.servicerequest.recurrenceEndDate,
    });

    // ! if there is recurrneign next dates
    if (
      newJob.isRecurring &&
      newJob.recurrenceFrequency &&
      newJob.recurrenceInterval &&
      newJob.recurrenceEndDate
    ) {
      // ! string not objects
      newJob.expectedRecurrenceDates = generateRecurrenceDates(
        newJob.startDate,
        newJob.recurrenceFrequency,
        newJob.recurrenceInterval,
        newJob.recurrenceEndDate
      );
    
    const providerAvailableDates = newJob.expectedRecurrenceDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return (
        date >= new Date(quote.startDate) && date <= new Date(quote.endDate)
      );
    });
    newJob.providerAvailableDates=providerAvailableDates
  }

    await jobRepo.save(newJob);
    return newJob;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const serviceGetJobById = async (jobId: any) => {
  try {
    return await jobRepo.findOne({
      relations: [
        "quote",
        "servicerequest",
        "providerprofile",
        "homeownerprofile",
        "review",
        "homeownerprofile.user",
        "providerprofile.user",
      ],
      where: { j_id: jobId },
    });
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

export const serviceUpdateJobStatus = async (jobId: any) => {
  try {
    const jobExists = await serviceGetJobById(jobId);
    if (!jobExists) {
      throw Error("Job Doesnt exists");
    }

    jobExists.status = JobStatus.COMPLETED;

    const serviceReq = await serviceFetchServiceReqById(
      jobExists.servicerequest?.s_id
    );
    // ! recurring false
    if (jobExists.isRecurring) {
      jobExists.isRecurring = false;
    }
    // ! sercie req false
    if (serviceReq) {
      serviceReq.isActive = false;
      serviceRequestRepository.save(serviceReq);
    }
    return await jobRepo.save(jobExists);
  } catch (error) {
    console.error("Error Updating job Status:", error);
    throw error;
  }
};

export const serviceUpdateJobPaymentStatus = async (jobId: any) => {
  try {
    const jobExists = await serviceGetJobById(jobId);
    if (!jobExists) {
      throw Error("Job Doesnt exists");
    }
    //  Only allow payment if job is completed
    if (jobExists.status !== JobStatus.COMPLETED) {
      throw new Error("Cannot mark payment as PAID. Job is not completed.");
    }
    jobExists.paymentStatus = PaymentStatus.PAID;

    return await jobRepo.save(jobExists);
  } catch (error) {
    console.error("Error Updating job Payment Status", error);
    throw error;
  }
};

export const serviceFetchJobByUserIdRole = async (u_id: any, role: any) => {
  try {
    if (role === "homeowner") {
      const jobs = await jobRepo.find({
        relations: [
          "homeownerprofile",
          "homeownerprofile.user",
          "quote",
          "servicerequest",
          "review",
          "providerprofile",
          "providerprofile.user",
        ],
        where: {
          homeownerprofile: {
            user: { u_id: u_id },
          },
        },
      });
      return jobs;
    } else if (role === "provider") {
      const jobs = await jobRepo.find({
        relations: [
          "homeownerprofile",
          "homeownerprofile.user",
          "quote",
          "servicerequest",
          "review",
          "providerprofile",
          "providerprofile.user",
        ],
        where: {
          providerprofile: {
            user: { u_id: u_id },
          },
        },
      });
      return jobs;
    } else {
      throw Error("No homeowner nor provider");
    }
  } catch (error) {
    console.error("Error Updating job Payment Status", error);
    throw error;
  }
};
