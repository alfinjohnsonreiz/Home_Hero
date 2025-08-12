import { Request, Response } from "express";
import {
  serviceFetchJobByUserIdRole,
  serviceGetJobById,
  serviceUpdateJobPaymentStatus,
  serviceUpdateJobStatus,
} from "../services/job.service";
import { PaymentStatus } from "../entity/Job";

export const updateJobStatusToCompleted = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = req.params;
    const { u_id, role } = (req as any).user;
    console.log(jobId);

    const jobExists = await serviceGetJobById(parseInt(jobId));

    if (!jobExists) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }
    console.log(jobExists);
    
    // !only owner can update job status
    if (role !== "provider" || jobExists.providerprofile.user.u_id !== u_id) {
      return res.status(403).json({ success: false, msg: "Unauthorized" });
    }
    const updatedjob = await serviceUpdateJobStatus(parseInt(jobId));
    return res.status(200).json({
      success: true,
      msg: "Job  status updated to Completed",
      data: updatedjob,
    });
  } catch (error) {
    console.error("Updating job Status error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

export const updateJobPaymentStatusToPaid = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = req.params;
    const { u_id, role } = (req as any).user;
    const jobExists = await serviceGetJobById(parseInt(jobId));
    if (!jobExists) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }
    // !only job owner can update
    if (role !== "homeowner" || jobExists.homeownerprofile  .user.u_id !== u_id) {
      return res.status(403).json({ success: false, msg: "Unauthorized" });
    }
    if (jobExists.paymentStatus === PaymentStatus.PAID) {
      return res
        .status(400)
        .json({ success: false, msg: "Job already marked as paid" });
    }

    const updateJob = await serviceUpdateJobPaymentStatus(parseInt(jobId));
    return res.status(200).json({
      success: true,
      msg: "Job payment status updated to PAID",
      data: updateJob,
    });
  } catch (error:any) {
    console.error("Updating job payment error:", error);
    return res
      .status(500)
      .json({ success: false, msg:error.message || "Internal Server Error" });
  }
};

// Fetching all jobs related to homeowner or provider
export const fetchJobs = async (req: Request, res: Response) => {
  try {
    const { u_id, role } = (req as any).user;
    const jobs = await serviceFetchJobByUserIdRole(u_id, role);

    return res.status(200).json({
      success: true,
      msg: `Jobs fetched for id ${u_id} ${role}`,
      data: jobs,
    });
  } catch (error:any) {
    console.error("Fetching job error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message ||"Internal Server Error" });
  }
};

