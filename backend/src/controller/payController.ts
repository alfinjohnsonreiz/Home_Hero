import { Request, Response } from "express";
import { serviceGetJobById } from "../services/job.service";
import { razorpay } from "../index";

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { jobID } = req.params;

    const job = await serviceGetJobById(parseInt(jobID));
    if (!job) {
      return res.status(404).json({ success: false, msg: "No job found" });
    }
    const price = job.price;
    const options = {
      amount: price * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    // console.log("Razorpay instance:", razorpay);
    // console.log("Key ID:", (razorpay as any).key_id); // or inspect if keys exist

    const order = await razorpay.orders.create(options);
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
