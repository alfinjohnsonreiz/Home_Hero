import { Request, Response } from "express";
import { serviceGetJobById } from "../services/job.service";
import { serviceCreateReview } from "../services/review.service";
import { JobStatus } from "../entity/Job";

//! Reviews for jobs only its status is completed
export const reviewForJob = async (req: Request, res: Response) => {
  try {
    const { u_id, role } = (req as any).user;
    const { jobId } = req.params;
    const { stars, comment } = req.body;

    const jobExists = await serviceGetJobById(parseInt(jobId));
    if (!jobExists) {
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    //! Only the owner of the job can post a review
    if (jobExists.homeownerprofile.user.u_id !== u_id) {
      return res
        .status(402)
        .json({ success: false, msg: "UnAuthorized your not owner" });
    }
    //! Check if job is completed
    if (jobExists.status !== JobStatus.COMPLETED) {
      return res
        .status(400)
        .json({ success: false, msg: "Job is not completed" });
    }
    //! ensure no review exists already
    if (jobExists.review) {
      return res
        .status(400)
        .json({ success: false, msg: "Review already exists for this job" });
    }

    const review = await serviceCreateReview(parseInt(jobId), stars, comment);
    return res.status(201).json({ success: true, review });
    
  } catch (error:any) {
    console.error("Reviews for  job error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message ||"Internal Server Error" });
  }
};
